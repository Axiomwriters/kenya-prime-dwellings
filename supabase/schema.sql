-- Enable necessary extensions
create extension if not exists "vector";
create extension if not exists "uuid-ossp";
-- PROFILES (Users)
create table public.profiles (
    id uuid references auth.users not null primary key,
    full_name text,
    avatar_url text,
    phone_number text,
    role text default 'user' check (role in ('user', 'agent', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Enable RLS on profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for
select using (true);
create policy "Users can insert their own profile." on profiles for
insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for
update using (auth.uid() = id);
-- AGENTS (Specific details for agent role)
create table public.agents (
    id uuid references public.profiles(id) not null primary key,
    agency_name text,
    license_number text,
    bio text,
    whatsapp_number text,
    is_verified boolean default false,
    rating numeric(2, 1) default 0.0,
    review_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Enable RLS on agents
alter table public.agents enable row level security;
create policy "Agents are viewable by everyone." on agents for
select using (true);
create policy "Agents can update their own details." on agents for
update using (auth.uid() = id);
create policy "Agents can insert their own details." on agents for
insert with check (auth.uid() = id);
-- PROPERTIES (Listings)
create table public.properties (
    id uuid default uuid_generate_v4() primary key,
    agent_id uuid references public.agents(id) not null,
    title text not null,
    description text,
    price numeric not null,
    location text not null,
    image_url text,
    images text [],
    -- Array of additional image URLs
    bedrooms integer,
    bathrooms integer,
    sqm numeric,
    -- Size in square meters
    land_size text,
    -- e.g. "0.5 acres" or "50x100"
    type text check (type in ('For Sale', 'For Rent', 'Short Stay')),
    property_type text,
    -- e.g. "Apartment", "Villa", "Land"
    status text default 'available' check (
        status in ('available', 'sold', 'rented', 'pending')
    ),
    is_high_growth boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Vector embedding for AI search (OpenAI text-embedding-ada-002 uses 1536 dimensions)
    embedding vector(1536)
);
-- Enable RLS on properties
alter table public.properties enable row level security;
create policy "Properties are viewable by everyone." on properties for
select using (true);
create policy "Agents can insert their own properties." on properties for
insert with check (auth.uid() = agent_id);
create policy "Agents can update their own properties." on properties for
update using (auth.uid() = agent_id);
create policy "Agents can delete their own properties." on properties for delete using (auth.uid() = agent_id);
-- SEARCH FUNCTION (RPC)
create or replace function match_properties (
        query_embedding vector(1536),
        match_threshold float,
        match_count int
    ) returns table (
        id uuid,
        title text,
        description text,
        price numeric,
        location text,
        image_url text,
        similarity float
    ) language plpgsql stable as $$ begin return query
select properties.id,
    properties.title,
    properties.description,
    properties.price,
    properties.location,
    properties.image_url,
    1 - (properties.embedding <=> query_embedding) as similarity
from properties
where 1 - (properties.embedding <=> query_embedding) > match_threshold
order by properties.embedding <=> query_embedding
limit match_count;
end;
$$;
-- TRIGGER: Handle new user signups
create or replace function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$ begin
insert into public.profiles (id, full_name, avatar_url)
values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
return new;
end;
$$;
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();