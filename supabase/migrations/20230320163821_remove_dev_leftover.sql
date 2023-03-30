drop policy "Enable read access for all users" on "public"."busy";

alter table "public"."busy" drop constraint "busy_pkey";

drop index if exists "public"."busy_pkey";

drop table "public"."busy";
