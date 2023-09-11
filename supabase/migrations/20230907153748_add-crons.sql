select
  cron.schedule (
    'delete-old-access-points',
    '@monthly',
    $$
    delete from public.access_points_latest_states where updated_at < now() - interval '30 days';
    $$
  );

select
  cron.schedule (
    'delete-old-cron-logs',
    '@weekly',
    $$
    delete from cron.job_run_details where end_time < now() - interval '7 days';
    $$
  );
