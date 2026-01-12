-- Fix vector dimensions for MiniLM model
alter table public.properties
alter column embedding type vector(384);
create or replace function match_properties (
    query_embedding vector(384),
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