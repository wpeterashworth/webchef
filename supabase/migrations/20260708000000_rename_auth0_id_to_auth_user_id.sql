-- WebChef — switch auth provider naming from Auth0 to Supabase Auth.
--
-- The project now uses Supabase Auth (email + password) instead of Auth0, so the
-- users.auth0_id column is renamed to auth_user_id. It still holds the auth
-- subject ("sub") — now the Supabase auth user id rather than the Auth0 one.
--
-- Forward-only: the original migration (20260623000000_initial_schema.sql) is
-- left untouched as historical record. This migration corrects the live schema.

alter table users rename column auth0_id to auth_user_id;

-- Keep the unique constraint's name in sync with the new column name.
alter table users rename constraint users_auth0_id_key to users_auth_user_id_key;

-- Replace the now-inaccurate inline comment with a correct DB-level one.
comment on column users.auth_user_id is 'Supabase Auth user id (the JWT "sub" claim)';
