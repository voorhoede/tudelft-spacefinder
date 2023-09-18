drop function
  if exists "public"."update_buildings_latest_states" ();

drop materialized view
  if exists "public"."buildings_latest_states";

create or replace view
  "public"."buildings_latest_states" as
SELECT
  access_points_latest_states.building_number,
  max(access_points_latest_states.updated_at) AS updated_at,
  sum(access_points_latest_states.device_count) AS device_count
FROM
  access_points_latest_states
GROUP BY
  access_points_latest_states.building_number;
