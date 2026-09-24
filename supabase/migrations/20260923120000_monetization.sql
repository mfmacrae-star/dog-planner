-- ============================================================================
-- Monetization: Stripe subscriptions for the Dog Planner
-- Created 2026-09-23. Additive migration - safe to run against the live project.
--
-- GRANTS ARE MANDATORY HERE. From 2026-10-30 Supabase no longer auto-grants
-- Data API access to new tables in `public`. A table created without the
-- grants below is invisible to supabase-js / PostgREST and returns
-- "permission denied" even when RLS looks correct.
--
-- Pricing per the April 2026 plan: $2.99/mo or $24.99/yr, permanent freemium.
-- Premium unlocks: unlimited AI queries, Google/Outlook sync, multi-pet, ICS.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- subscriptions : one row per user, written only by the Stripe webhook
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  user_id                 uuid primary key references auth.users (id) on delete cascade,
  email                   text not null,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  status                  text not null default 'free'
                            check (status in ('free','trialing','active','past_due','canceled','incomplete')),
  plan                    text
                            check (plan is null or plan in ('monthly','annual')),
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- `email` mirrors auth.users.email because the rest of this app keys off email
-- (see hourly_plans, which filters on .eq("email", userEmail)). Keep both:
-- user_id is the integrity anchor, email is what the existing UI already has.
create index if not exists subscriptions_email_idx  on public.subscriptions (email);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

-- Single source of truth for "is this user premium right now".
create or replace function public.is_premium(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.subscriptions s
     where s.email = p_email
       and s.status in ('active','trialing')
       and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

-- ---------------------------------------------------------------------------
-- stripe_events : webhook idempotency ledger. Stripe retries; this stops
-- a retried event from double-applying.
-- ---------------------------------------------------------------------------
create table if not exists public.stripe_events (
  id           text primary key,          -- Stripe's own evt_... id
  type         text not null,
  payload      jsonb not null,
  processed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS. Grants and RLS are SEPARATE layers - both are required.
-- ---------------------------------------------------------------------------
alter table public.subscriptions enable row level security;
alter table public.stripe_events enable row level security;

drop policy if exists "read own subscription" on public.subscriptions;
create policy "read own subscription"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- No insert/update/delete policy for authenticated on purpose: billing state is
-- written ONLY by the Stripe webhook running as service_role, which bypasses RLS.
-- A user must never be able to set their own status to 'active'.

-- stripe_events gets no policy at all - service_role only.

-- ---------------------------------------------------------------------------
-- GRANTS - required from 2026-10-30 onward
-- ---------------------------------------------------------------------------

-- anon: NOTHING. Billing state must not be readable by logged-out visitors.
-- This deliberately departs from Supabase's boilerplate `grant select ... to anon`.

grant select on public.subscriptions to authenticated;
grant select, insert, update, delete on public.subscriptions to service_role;

grant select, insert, update, delete on public.stripe_events to service_role;

grant execute on function public.is_premium(text) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();
