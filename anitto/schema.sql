-- ANITTO MVP DATABASE SCHEMA
-- Supabase SQL Editor에서 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists settings (
    key text primary key,
    value text not null
);

insert into settings(key, value) values
('game_started', 'false'),
('game_ended', 'false'),
('signup_closed', 'false')
on conflict (key) do nothing;

create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    real_name text not null,
    nickname text not null unique,
    score integer not null default 0,
    coins integer not null default 0,
    joined_party boolean not null default false,
    is_admin boolean not null default false,
    created_at timestamptz not null default now()
);

alter table profiles
add column if not exists joined_party boolean not null default false;

create table if not exists manittos (
    id uuid primary key default gen_random_uuid(),
    giver_id uuid not null references profiles(id) on delete cascade,
    receiver_id uuid not null references profiles(id) on delete cascade,
    revealed boolean not null default false,
    created_at timestamptz not null default now(),
    unique(giver_id),
    unique(receiver_id),
    check (giver_id <> receiver_id)
);

create table if not exists missions (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    score_reward integer not null default 0,
    coin_reward integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists mission_requests (
    id uuid primary key default gen_random_uuid(),
    requester_id uuid not null references profiles(id) on delete cascade,
    title text not null,
    description text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz not null default now()
);

create table if not exists mission_completions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    mission_id uuid not null references missions(id) on delete cascade,
    photo_url text,
    description text,
    selected_for_ending boolean not null default false,
    created_at timestamptz not null default now(),
    unique(user_id, mission_id)
);

create table if not exists letters (
    id uuid primary key default gen_random_uuid(),
    sender_id uuid not null references profiles(id) on delete cascade,
    receiver_id uuid not null references profiles(id) on delete cascade,
    content text not null,
    reaction text,
    is_shared_for_ending boolean not null default false,
    created_at timestamptz not null default now(),
    check(sender_id <> receiver_id)
);

create table if not exists megaphones (
    id uuid primary key default gen_random_uuid(),
    author_id uuid not null references profiles(id) on delete cascade,
    content text not null,
    is_anonymous boolean not null default false,
    display_type text not null default 'real_name' check (display_type in ('real_name', 'nickname', 'manitto')),
    likes integer not null default 0,
    dislikes integer not null default 0,
    created_at timestamptz not null default now()
);

alter table megaphones
add column if not exists display_type text not null default 'real_name'
check (display_type in ('real_name', 'nickname', 'manitto'));

create table if not exists megaphone_reactions (
    id uuid primary key default gen_random_uuid(),
    megaphone_id uuid not null references megaphones(id) on delete cascade,
    user_id uuid not null references profiles(id) on delete cascade,
    reaction_type text not null check (reaction_type in ('like', 'dislike')),
    created_at timestamptz not null default now(),
    unique(megaphone_id, user_id)
);

create table if not exists deductions (
    id uuid primary key default gen_random_uuid(),
    guesser_id uuid not null references profiles(id) on delete cascade,
    target_user_id uuid not null references profiles(id) on delete cascade,
    guessed_manitto_id uuid not null references profiles(id) on delete cascade,
    is_correct boolean not null,
    created_at timestamptz not null default now()
);

create table if not exists notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    type text not null,
    message text not null,
    is_read boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists ending_credits (
    id uuid primary key default gen_random_uuid(),
    content_type text not null check (content_type in ('mission', 'letter', 'megaphone', 'award')),
    reference_id uuid,
    display_order integer not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_profiles_score on profiles(score desc);
create index if not exists idx_missions_active on missions(is_active);
create index if not exists idx_mission_requests_status on mission_requests(status, created_at desc);
create index if not exists idx_mission_completions_user on mission_completions(user_id);
create index if not exists idx_letters_receiver on letters(receiver_id);
create index if not exists idx_letters_sender on letters(sender_id);
create index if not exists idx_megaphones_created on megaphones(created_at desc);
create index if not exists idx_notifications_user on notifications(user_id, is_read);
create index if not exists idx_deductions_guesser on deductions(guesser_id);
create index if not exists idx_ending_order on ending_credits(display_order);

create or replace function create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_nickname text;
begin
  requested_nickname := nullif(trim(new.raw_user_meta_data->>'nickname'), '');

  if requested_nickname is null then
    raise exception 'nickname is required';
  end if;

  if exists (select 1 from public.profiles where nickname = requested_nickname) then
    raise exception 'nickname already exists';
  end if;

  insert into public.profiles (id, real_name, nickname)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'real_name'), ''), '이름없음'),
    requested_nickname
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function create_profile_for_new_user();

-- MVP 개발 중 테스트를 쉽게 하기 위한 정책입니다.
-- 실제 배포 전에는 사용자별 접근 권한과 관리자 전용 작업을 더 엄격하게 나누세요.
alter table profiles enable row level security;
alter table settings enable row level security;
alter table manittos enable row level security;
alter table missions enable row level security;
alter table mission_requests enable row level security;
alter table mission_completions enable row level security;
alter table letters enable row level security;
alter table megaphones enable row level security;
alter table megaphone_reactions enable row level security;
alter table deductions enable row level security;
alter table notifications enable row level security;
alter table ending_credits enable row level security;

create policy "authenticated read profiles" on profiles for select to authenticated using (true);
create policy "own profile update" on profiles for update to authenticated using (auth.uid() = id);
create policy "authenticated read settings" on settings for select to authenticated using (true);
create policy "authenticated write settings" on settings for all to authenticated using (true) with check (true);
create policy "authenticated all manittos" on manittos for all to authenticated using (true) with check (true);
create policy "authenticated all missions" on missions for all to authenticated using (true) with check (true);
create policy "authenticated all mission requests" on mission_requests for all to authenticated using (true) with check (true);
create policy "authenticated all completions" on mission_completions for all to authenticated using (true) with check (true);
create policy "authenticated all letters" on letters for all to authenticated using (true) with check (true);
create policy "authenticated all megaphones" on megaphones for all to authenticated using (true) with check (true);
create policy "authenticated all megaphone reactions" on megaphone_reactions for all to authenticated using (true) with check (true);
create policy "authenticated all deductions" on deductions for all to authenticated using (true) with check (true);
create policy "authenticated all notifications" on notifications for all to authenticated using (true) with check (true);
create policy "authenticated all ending credits" on ending_credits for all to authenticated using (true) with check (true);
