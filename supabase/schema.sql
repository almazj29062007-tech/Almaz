-- Run in Supabase SQL Editor. Never expose service role key to the browser.
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 5 and 120),
  phone text not null,
  category text not null check (category in ('A','B','EXPRESS')),
  study_time text not null check (study_time in ('morning','evening','weekend')),
  status text not null default 'new' check (status in ('new','contacted','accepted','cancelled')),
  created_at timestamptz not null default now()
);
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create index if not exists applications_created_at_idx on public.applications(created_at desc);
alter table public.applications enable row level security;
alter table public.admin_users enable row level security;
-- No public RLS policies: only server-side service role can read/write these tables.
-- After creating an admin account in Supabase Auth, run:
-- insert into public.admin_users(user_id) values ('AUTH_USER_UUID');

-- Content management tables
create table if not exists public.courses (
 code text primary key check(code in ('A','B','EXPRESS')),
 name text not null, price integer not null check(price >= 0),
 description text not null default '', sort_order integer not null default 0
);
insert into public.courses(code,name,price,description,sort_order) values
 ('A','A toifa',1800000,'Mototsikl boshqarishni noldan o‘rganish.',1),
 ('B','B toifa',3500000,'Yengil avtomobil boshqarishni noldan o‘rganish.',2),
 ('EXPRESS','Express',750000,'Avtomaktabni bitirganlar uchun test imtihoniga tayyorlov.',3)
on conflict (code) do nothing;
create table if not exists public.posts (
 id uuid primary key default gen_random_uuid(),
 type text not null check(type in ('news','result')),
 title text not null, description text not null default '',
 published boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
 key text primary key, value text not null default ''
);
insert into public.site_settings(key,value) values
 ('hero_title','Yo‘l seniki. Tanlov ham.'),
 ('hero_description','Ishonchli haydovchi bo‘lish sari ilk qadamingni biz bilan boshla.'),
 ('final_quote','Orzular manzilga o‘zi yetib bormaydi. Rulni qo‘lga ol!')
on conflict (key) do nothing;
alter table public.courses enable row level security;
alter table public.posts enable row level security;
alter table public.site_settings enable row level security;
-- No public RLS policies. Public content is filtered and served by server API.
