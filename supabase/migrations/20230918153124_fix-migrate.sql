set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.refresh_materialized_access_point_data()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  REFRESH MATERIALIZED VIEW public.buildings_latest_states;
  REFRESH materialized view public.spaces_latest_states;
  RETURN;
END;
$function$
;
