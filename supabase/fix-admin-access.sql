-- Execute uma vez no SQL Editor do Supabase para liberar os dados do painel.
-- O script e idempotente e nao remove usuarios, perfis ou resultados.

begin;

-- Recria perfis que possam ter sido cadastrados antes da criacao do trigger.
insert into public.profiles (id, full_name, email, role)
select
  users.id,
  coalesce(users.raw_user_meta_data->>'full_name', ''),
  users.email,
  'student'
from auth.users as users
on conflict (id) do update
set
  email = excluded.email,
  full_name = case
    when coalesce(public.profiles.full_name, '') = '' then excluded.full_name
    else public.profiles.full_name
  end;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "attempts_insert_own" on public.quiz_attempts;
create policy "attempts_insert_own"
on public.quiz_attempts for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "attempts_select_own_admin" on public.quiz_attempts;
create policy "attempts_select_own_admin"
on public.quiz_attempts for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "questions_select_active" on public.questions;
create policy "questions_select_active"
on public.questions for select to authenticated
using (is_active = true or public.is_admin());

grant select, update on public.profiles to authenticated;
grant select on public.questions to authenticated;
grant select, insert on public.quiz_attempts to authenticated;

commit;
