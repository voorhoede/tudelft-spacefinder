drop view if exists "public"."buildings_latest_states";

drop view if exists "public"."spaces_latest_states";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.refresh_materialized_access_point_data()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.buildings_latest_states;
  REFRESH materialized view public.spaces_latest_states;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

create materialized view
  public.buildings_latest_states AS
select
  access_points_latest_states.building_number,
  max(access_points_latest_states.updated_at) as updated_at,
  sum(access_points_latest_states.device_count) as device_count
from
  access_points_latest_states
group by
  access_points_latest_states.building_number;

create materialized view
  public.spaces_latest_states as
select
  access_points_latest_states.building_number,
  access_points_latest_states.room_id,
  max(access_points_latest_states.updated_at) as updated_at,
  sum(access_points_latest_states.device_count) as device_count
from
  access_points_latest_states
group by
  access_points_latest_states.building_number,
  access_points_latest_states.room_id;

CREATE TRIGGER on_access_points_change AFTER INSERT OR UPDATE ON public.access_points_latest_states FOR EACH STATEMENT EXECUTE FUNCTION refresh_materialized_access_point_data();
