create table "public"."collections" (
    "user_id" uuid,
    "name" text,
    "slug" text,
    "description" text,
    "owner_address" character varying,
    "thumbnail_url" text,
    "banner_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "draft" boolean not null default true,
    "id" bigint generated by default as identity not null
);


alter table "public"."collections" enable row level security;

create table "public"."stems" (
    "id" bigint generated by default as identity not null,
    "collection_id" bigint not null,
    "token_id" integer,
    "name" text,
    "description" text,
    "image_hash" character varying,
    "audio_hash" character varying,
    "supply" integer,
    "price" numeric,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "instrument" text,
    "bpm" numeric,
    "key" character varying,
    "genre" text,
    "license" text
);


CREATE UNIQUE INDEX collections_pkey ON public.collections USING btree (id);

CREATE UNIQUE INDEX stems_pkey ON public.stems USING btree (id);

alter table "public"."collections" add constraint "collections_pkey" PRIMARY KEY using index "collections_pkey";

alter table "public"."stems" add constraint "stems_pkey" PRIMARY KEY using index "stems_pkey";

alter table "public"."collections" add constraint "collections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."collections" validate constraint "collections_user_id_fkey";

alter table "public"."stems" add constraint "stems_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES collections(id) not valid;

alter table "public"."stems" validate constraint "stems_collection_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (id, moralis_provider_id, metadata)
  values (new.id, new.moralis_provider_id, new.metadata);
  return new;
end;
$function$
;

create policy "Enable all actions  for users based on user_id"
on "public"."collections"
as permissive
for all
to public
using ((next_auth.uid() = user_id))
with check ((next_auth.uid() = user_id));



alter table "next_auth"."users" alter column "created_at" set default now();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON next_auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


