create table if not exists public.enquiries (
  id text primary key default ('TG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  name text not null,
  company text not null,
  phone text not null,
  email text not null,
  occasion text not null,
  units integer not null check (units > 0),
  budget text not null,
  delivery_date date,
  products text[] not null default '{}',
  customisations text[] not null default '{}',
  message text not null default '',
  source text not null check (source in ('Website', 'Mobile app')),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Converted', 'Lost')),
  created_at timestamptz not null default now()
);

