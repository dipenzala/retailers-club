-- ==========================================
-- Extended Profile Fields (IndiaMart style)
-- ==========================================
do $$ begin
  alter table profiles add column if not exists alternate_phone text;
  alter table profiles add column if not exists email text;
  alter table profiles add column if not exists whatsapp text;
  alter table profiles add column if not exists website text;
  alter table profiles add column if not exists gst_number text;
  alter table profiles add column if not exists pan_number text;
  alter table profiles add column if not exists msme_number text;
  alter table profiles add column if not exists business_type text;
  alter table profiles add column if not exists established_year int;
  alter table profiles add column if not exists employee_count text;
  alter table profiles add column if not exists annual_turnover text;
  alter table profiles add column if not exists designation text;
  alter table profiles add column if not exists address text;
  alter table profiles add column if not exists district text;
  alter table profiles add column if not exists country text default 'India';
  alter table profiles add column if not exists business_hours text;
  alter table profiles add column if not exists business_description text;
  alter table profiles add column if not exists primary_category text;
  alter table profiles add column if not exists secondary_categories text[] default '{}';
  alter table profiles add column if not exists instagram text;
  alter table profiles add column if not exists facebook text;
  alter table profiles add column if not exists bank_name text;
  alter table profiles add column if not exists account_number text;
  alter table profiles add column if not exists ifsc_code text;
  alter table profiles add column if not exists gst_verified boolean default false;
  alter table profiles add column if not exists pan_verified boolean default false;
  alter table profiles add column if not exists msme_verified boolean default false;
exception when others then null;
end $$;

-- Extended Product Fields (garment specific)
do $$ begin
  alter table products add column if not exists subcategory text;
  alter table products add column if not exists pattern text;
  alter table products add column if not exists occasion text;
  alter table products add column if not exists sleeve_type text;
  alter table products add column if not exists neck_type text;
  alter table products add column if not exists fit text;
  alter table products add column if not exists length text;
  alter table products add column if not exists sizes text[] default '{}';
  alter table products add column if not exists available_colors text[] default '{}';
  alter table products add column if not exists season text;
  alter table products add column if not exists wash_care text;
  alter table products add column if not exists country_of_origin text default 'India';
  alter table products add column if not exists ready_stock boolean default false;
  alter table products add column if not exists customizable boolean default false;
  alter table products add column if not exists sample_available boolean default false;
  alter table products add column if not exists sample_price numeric;
  alter table products add column if not exists tags text[] default '{}';
  alter table products add column if not exists hsn_code text;
  alter table products add column if not exists weight_grams int;
exception when others then null;
end $$;

-- Categories table (for filter dropdowns)
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  parent_slug text,
  icon text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table categories enable row level security;
drop policy if exists "categories_read" on categories;
create policy "categories_read" on categories for select using (true);

-- Seed categories
insert into categories (name, slug, parent_slug, sort_order) values
  ('Women''s Wear', 'womens-wear', null, 1),
  ('Men''s Wear', 'mens-wear', null, 2),
  ('Kids Wear', 'kids-wear', null, 3),
  ('Ethnic Wear', 'ethnic-wear', null, 4),
  ('Winter Wear', 'winter-wear', null, 5),
  ('Sports Wear', 'sports-wear', null, 6),
  ('Innerwear', 'innerwear', null, 7),
  ('Accessories', 'accessories', null, 8),
  ('Kurtis & Suits', 'kurtis-suits', 'womens-wear', 1),
  ('Sarees', 'sarees', 'womens-wear', 2),
  ('Tops & Tunics', 'tops-tunics', 'womens-wear', 3),
  ('Lehenga Choli', 'lehenga-choli', 'ethnic-wear', 1),
  ('Sherwani', 'sherwani', 'ethnic-wear', 2),
  ('Salwar Kameez', 'salwar-kameez', 'ethnic-wear', 3),
  ('Shirts', 'shirts', 'mens-wear', 1),
  ('T-Shirts', 'tshirts', 'mens-wear', 2),
  ('Jeans', 'jeans', 'mens-wear', 3),
  ('Trousers', 'trousers', 'mens-wear', 4),
  ('Kurta Pyjama', 'kurta-pyjama', 'mens-wear', 5),
  ('Boys Clothing', 'boys-clothing', 'kids-wear', 1),
  ('Girls Clothing', 'girls-clothing', 'kids-wear', 2),
  ('Newborn', 'newborn', 'kids-wear', 3),
  ('Jackets & Coats', 'jackets-coats', 'winter-wear', 1),
  ('Sweaters', 'sweaters', 'winter-wear', 2),
  ('Hoodies', 'hoodies', 'winter-wear', 3)
on conflict (slug) do nothing;
