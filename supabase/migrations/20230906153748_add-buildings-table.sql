create table "public"."buildings" (
    "created_at" timestamp with time zone default now(),
    "number" smallint not null,
    "opening_hours" jsonb
);


alter table "public"."buildings" enable row level security;

CREATE UNIQUE INDEX buildings_number_key ON public.buildings USING btree (number);

CREATE UNIQUE INDEX buildings_pkey ON public.buildings USING btree (number);

alter table "public"."buildings" add constraint "buildings_pkey" PRIMARY KEY using index "buildings_pkey";

alter table "public"."buildings" add constraint "buildings_number_key" UNIQUE using index "buildings_number_key";

create policy "Enable read access for all users"
on "public"."buildings"
as permissive
for select
to public
using (true);
