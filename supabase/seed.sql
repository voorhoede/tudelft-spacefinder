insert into
  public.access_points_latest_states (
    updated_at,
    access_point_name,
    building_number,
    room_id,
    device_count
  )
values
  (now(), 'A-21-0-034', '21', '21.01', 78),
  (now(), 'A-32-0-043', '32', '32.02', 58),
  (now(), 'A-36-0-025', '36', null, 54),
  (now(), 'A-32-0-029', '32', null, 46);
