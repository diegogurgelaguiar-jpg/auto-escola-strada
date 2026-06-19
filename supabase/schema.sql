create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  difficulty text not null default 'normal' check (difficulty in ('facil', 'normal', 'dificil')),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text,
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null default 'completo',
  category text,
  total_questions int not null,
  correct_answers int not null,
  percentage int not null,
  passed boolean not null default false,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists questions_touch_updated_at on public.questions;
create trigger questions_touch_updated_at
before update on public.questions
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'student'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

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
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

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

drop policy if exists "questions_select_active" on public.questions;
create policy "questions_select_active"
on public.questions for select to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "questions_admin_insert" on public.questions;
create policy "questions_admin_insert"
on public.questions for insert to authenticated
with check (public.is_admin());

drop policy if exists "questions_admin_update" on public.questions;
create policy "questions_admin_update"
on public.questions for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "questions_admin_delete" on public.questions;
create policy "questions_admin_delete"
on public.questions for delete to authenticated
using (public.is_admin());

drop policy if exists "attempts_insert_own" on public.quiz_attempts;
create policy "attempts_insert_own"
on public.quiz_attempts for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "attempts_select_own_admin" on public.quiz_attempts;
create policy "attempts_select_own_admin"
on public.quiz_attempts for select to authenticated
using (user_id = auth.uid() or public.is_admin());

insert into public.questions
(category, difficulty, question, option_a, option_b, option_c, option_d, correct_option, explanation)
values
('Legislação', 'facil', 'Em uma via sinalizada com placa de PARE, o condutor deve:', 'Reduzir a velocidade e seguir se não houver veículos', 'Buzinar antes de cruzar', 'Parar completamente antes de prosseguir', 'Aumentar a velocidade para atravessar rápido', 'C', 'A sinalização de PARE exige parada obrigatória antes de prosseguir.'),
('Direção defensiva', 'normal', 'Direção defensiva é a forma de dirigir que busca:', 'Chegar mais rápido ao destino', 'Evitar acidentes apesar das ações incorretas dos outros e das condições adversas', 'Usar sempre a velocidade máxima da via', 'Ultrapassar veículos lentos sempre que possível', 'B', 'Direção defensiva é dirigir com prevenção, atenção e segurança.'),
('Primeiros socorros', 'normal', 'Ao presenciar um acidente com vítima, a primeira atitude correta é:', 'Remover a vítima imediatamente', 'Dar água para a vítima', 'Sinalizar o local e acionar o socorro especializado', 'Colocar a vítima em pé', 'C', 'O local deve ser sinalizado e o socorro deve ser chamado. A vítima não deve ser removida sem necessidade.'),
('Meio ambiente', 'facil', 'Uma atitude que contribui para reduzir a poluição causada por veículos é:', 'Manter o veículo regulado e revisado', 'Retirar o escapamento', 'Acelerar em ponto morto', 'Usar combustível adulterado', 'A', 'Manutenção preventiva reduz consumo, emissão de poluentes e riscos mecânicos.'),
('Placas', 'facil', 'As placas de regulamentação geralmente indicam:', 'Pontos turísticos', 'Informações educativas sem obrigação', 'Obrigações, proibições ou restrições ao condutor', 'Apenas mensagens publicitárias', 'C', 'Placas de regulamentação impõem regras que devem ser obedecidas.'),
('Infrações', 'normal', 'Estacionar em local proibido pela sinalização é:', 'Conduta permitida se for por poucos minutos', 'Infração de trânsito conforme a sinalização e a legislação aplicável', 'Permitido quando o pisca-alerta estiver ligado', 'Permitido aos fins de semana sempre', 'B', 'O condutor deve obedecer à sinalização de estacionamento e parada.')
on conflict do nothing;
