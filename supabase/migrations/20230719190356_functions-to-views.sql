drop trigger if exists "update_buildings_latest_states_on_access_points_events" on "public"."access_points_latest_states";

drop trigger if exists "update_spaces_latest_states_on_access_points_events" on "public"."access_points_latest_states";

drop policy "Enable read access for all users" on "public"."buildings_latest_states";

drop policy "Enable read access for all users" on "public"."spaces_latest_states";

drop function if exists "public"."update_buildings_latest_states"();

drop function if exists "public"."update_spaces_latest_states"();

alter table "public"."buildings_latest_states" drop constraint "BuildingsCurrent_pkey";

alter table "public"."spaces_latest_states" drop constraint "SpacesCurrent_pkey";

drop index if exists "public"."BuildingsCurrent_pkey";

drop index if exists "public"."SpacesCurrent_pkey";

drop table "public"."buildings_latest_states";

drop table "public"."spaces_latest_states";

create or replace view "public"."buildings_latest_states" as  SELECT access_points_latest_states.building_number,
    max(access_points_latest_states.updated_at) AS updated_at,
    sum(access_points_latest_states.device_count) AS device_count
   FROM access_points_latest_states
  GROUP BY access_points_latest_states.building_number;


create or replace view "public"."spaces_latest_states" as  SELECT access_points_latest_states.building_number,
    access_points_latest_states.room_id,
    max(access_points_latest_states.updated_at) AS updated_at,
    sum(access_points_latest_states.device_count) AS device_count
   FROM access_points_latest_states
  GROUP BY access_points_latest_states.building_number, access_points_latest_states.room_id;

alter table "public"."access_points_latest_states" enable row level security;
