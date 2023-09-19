drop trigger if exists "on_access_points_change" on "public"."access_points_latest_states";

alter role authenticator set statement_timeout = '30s';
