CREATE OR REPLACE FUNCTION "public"."update_buildings_latest_states"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$

DECLARE
    earliest_time_considered timestamp with time zone := NOW() - '1 hour'::interval;
    triggering_building_number bigint := COALESCE(new.building_number, old.building_number);
    device_count_sum bigint;
    updated_at_max timestamp with time zone;

BEGIN

SELECT SUM(device_count), MAX(updated_at)
INTO device_count_sum, updated_at_max
FROM access_points_latest_states
WHERE building_number = triggering_building_number
AND updated_at > earliest_time_considered;

IF (updated_at_max IS NULL) THEN
    DELETE FROM buildings_latest_states WHERE building_number = triggering_building_number;
ELSE

    INSERT INTO buildings_latest_states (building_number, device_count, updated_at)
    SELECT triggering_building_number, device_count_sum, updated_at_max
    ON CONFLICT (building_number)
    DO UPDATE SET device_count = EXCLUDED.device_count, updated_at = EXCLUDED.updated_at;
END IF;
RETURN NULL;
END;
$$;

ALTER FUNCTION "public"."update_buildings_latest_states"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_spaces_latest_states"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
    
DECLARE
    earliest_time_considered timestamp with time zone := NOW() - '1 hour'::interval;
    triggering_building_number bigint := COALESCE(new.building_number, old.building_number);
    triggering_room_id text :=COALESCE(new.room_id, old.room_id);
    device_count_sum bigint;
    updated_at_max timestamp with time zone;

BEGIN

IF triggering_room_id IS NOT NULL THEN

    SELECT SUM(device_count), MAX(updated_at)
    INTO device_count_sum, updated_at_max
    FROM access_points_latest_states
    WHERE building_number = triggering_building_number
    AND room_id = triggering_room_id
    AND updated_at > earliest_time_considered;

    IF (updated_at_max IS NULL) THEN
        DELETE FROM spaces_latest_states WHERE building_number = triggering_building_number AND room_id = triggering_room_id;
    ELSE
        INSERT INTO spaces_latest_states (building_number, room_id, device_count, updated_at)
        SELECT triggering_building_number, triggering_room_id, device_count_sum, updated_at_max
        ON CONFLICT (building_number, room_id)
        DO UPDATE SET device_count = EXCLUDED.device_count, updated_at = EXCLUDED.updated_at;
    END IF;

END IF;
RETURN NULL;
END;
$$;

ALTER FUNCTION "public"."update_spaces_latest_states"() OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."update_buildings_latest_states"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_buildings_latest_states"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_buildings_latest_states"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_spaces_latest_states"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_spaces_latest_states"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_spaces_latest_states"() TO "service_role";
