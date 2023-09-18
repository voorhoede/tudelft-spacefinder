DROP FUNCTION public.refresh_materialized_access_point_data;

CREATE FUNCTION public.refresh_materialized_access_point_data()
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.buildings_latest_states;
  REFRESH MATERIALIZED VIEW public.spaces_latest_states;
  RETURN;
END;
$$ LANGUAGE plpgsql;
