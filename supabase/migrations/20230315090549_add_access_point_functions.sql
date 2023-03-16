CREATE FUNCTION "public"."update_buildings_latest_states"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
INSERT INTO buildings_latest_states (building_number, device_count, updated_at)
SELECT COALESCE(new.building_number, old.building_number), SUM(device_count) as device_count_sum, MAX(updated_at) as updated_at_max
FROM access_points_latest_states
WHERE building_number = COALESCE(new.building_number, old.building_number) 
ON CONFLICT (building_number)
DO UPDATE SET device_count = EXCLUDED.device_count, updated_at = EXCLUDED.updated_at;
RETURN NULL;
END$$;

ALTER FUNCTION "public"."update_buildings_latest_states"() OWNER TO "postgres";

CREATE FUNCTION "public"."update_spaces_latest_states"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
IF COALESCE(new.room_id, old.room_id) IS NOT NULL THEN
INSERT INTO spaces_latest_states (building_number, room_id, device_count, updated_at)
SELECT COALESCE(new.building_number, old.building_number), COALESCE(new.room_id, old.room_id), SUM(device_count) as device_count_sum, MAX(updated_at) as updated_at_max
FROM access_points_latest_states
ON CONFLICT (building_number, room_id)
DO UPDATE SET device_count = EXCLUDED.device_count, updated_at = EXCLUDED.updated_at;
END IF;
RETURN NULL;
END$$;

ALTER FUNCTION "public"."update_spaces_latest_states"() OWNER TO "postgres";

CREATE TRIGGER "update_buildings_latest_states_on_access_points_events" AFTER INSERT OR DELETE OR UPDATE ON "public"."access_points_latest_states" FOR EACH ROW EXECUTE FUNCTION "public"."update_buildings_latest_states"();

CREATE TRIGGER "update_spaces_latest_states_on_access_points_events" AFTER INSERT OR DELETE OR UPDATE ON "public"."access_points_latest_states" FOR EACH ROW EXECUTE FUNCTION "public"."update_spaces_latest_states"();

GRANT ALL ON FUNCTION "public"."update_buildings_latest_states"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_buildings_latest_states"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_buildings_latest_states"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_spaces_latest_states"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_spaces_latest_states"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_spaces_latest_states"() TO "service_role";
