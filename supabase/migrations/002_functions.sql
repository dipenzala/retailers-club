-- ============================================
-- Semantic search RPC
-- ============================================
create or replace function search_products_semantic(
  query_embedding vector(1536),
  match_threshold float default 0.5,
  match_count int default 20
)
returns table (
  id uuid,
  title text,
  category text,
  price numeric,
  similarity float
)
language sql stable
as $$
  select
    products.id,
    products.title,
    products.category,
    products.price,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  where products.embedding is not null
    and 1 - (products.embedding <=> query_embedding) > match_threshold
  order by products.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================
-- Nearby search (PostGIS)
-- ============================================
create or replace function nearby_manufacturers(
  lat float,
  lng float,
  radius_km int default 25,
  result_limit int default 20
)
returns table (
  id uuid,
  business_name text,
  city text,
  distance_km float
)
language sql stable
as $$
  select
    profiles.id,
    profiles.business_name,
    profiles.city,
    st_distance(profiles.location, st_makepoint(lng, lat)::geography) / 1000 as distance_km
  from profiles
  where profiles.location is not null
    and profiles.role = 'manufacturer'
    and st_dwithin(profiles.location, st_makepoint(lng, lat)::geography, radius_km * 1000)
  order by distance_km
  limit result_limit;
$$;
