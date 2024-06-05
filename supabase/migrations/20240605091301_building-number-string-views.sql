do $$            
  declare buildings_latest_states_def text;
  declare spaces_latest_states_def text;
  declare exec_text_one text;
  declare exec_text_two text;
begin          
  buildings_latest_states_def := pg_get_viewdef('buildings_latest_states');
  drop materialized view buildings_latest_states;
  spaces_latest_states_def := pg_get_viewdef('spaces_latest_states');
  drop materialized view spaces_latest_states;

  alter table "public"."access_points_latest_states" alter column "building_number" set data type text using "building_number"::text;
  
  exec_text_one := format('create view buildings_latest_states as %s', 
      buildings_latest_states_def);
  execute exec_text_one;
  exec_text_two := format('create view spaces_latest_states as %s', 
      spaces_latest_states_def);
  execute exec_text_two;
end $$;
