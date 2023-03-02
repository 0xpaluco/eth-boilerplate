create table "public"."users" (
    "id" uuid not null,
    "moralis_provider_id" character varying,
    "metadata" json
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES next_auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (id, moralis_provider_id, metadata)
  values (new.id, new.name, new.moralis_provider_id, new.metadata);
  return new;
end;
$function$
;

create policy "Can update own user data."
on "public"."users"
as permissive
for update
to public
using ((next_auth.uid() = id));


create policy "Can view own user data."
on "public"."users"
as permissive
for select
to public
using ((next_auth.uid() = id));



