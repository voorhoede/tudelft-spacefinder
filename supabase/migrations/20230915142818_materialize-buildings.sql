drop view if exists "public"."buildings_latest_states";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_buildings_latest_states()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    REFRESH MATERIALIZED VIEW buildings_latest_states;
    RETURN NULL;
END;
$function$
;

create materialized view "public"."buildings_latest_states" as  SELECT access_points_latest_states.building_number,
    max(access_points_latest_states.updated_at) AS updated_at,
    sum(access_points_latest_states.device_count) AS device_count
   FROM access_points_latest_states
  GROUP BY access_points_latest_states.building_number;
