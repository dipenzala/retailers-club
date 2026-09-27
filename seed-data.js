require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const manufacturers = [
  {
    email: "demo.surat.textiles@retailersclub.com",
    password: "Demo@12345",
    business_name: "Surat Textile House",
    city: "Surat",
    role: "manufacturer",
    is_verified: true,
  },
  {
    email: "demo.jaipur.fashion@retailersclub.com",
    password: "Demo@12345",
    business_name: "Jaipur Ethnic Fashion",
    city: "Jaipur",
    role: "manufacturer",
    is_verified: true,
  },
  {
    email: "demo.delhi.garments@retailersclub.com",
    password: "Demo@12345",
    business_name: "Delhi Garments Co.",
    city: "New Delhi",
    role: "manufacturer",
    is_verified: true,
  },
  {
    email: "demo.ludhiana.knit@retailersclub.com",
    password: "Demo@12345",
    business_name: "Ludhiana Knitwear",
    city: "Ludhiana",
    role: "manufacturer",
    is_verified: false,
  },
  {
    email: "demo.mumbai.cotton@retailersclub.com",
    password: "Demo@12345",
    business_name: "Mumbai Cotton Mills",
    city: "Mumbai",
    role: "manufacturer",
    is_verified: true,
  },
];

const productsByManufacturer = [
  // Surat Textile House
  [
    { title: "Cotton Kurti — Floral Print", price: 285, moq: 100, category: "Women's Wear", fabric: "Cotton", color: "Pink", gender: "Women",
      desc: "Soft cotton kurti with floral print. Perfect for daily wear and casual occasions.", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800" },
    { title: "Rayon Palazzo Set — Navy", price: 420, moq: 80, category: "Women's Wear", fabric: "Rayon", color: "Navy", gender: "Women",
      desc: "Comfortable rayon palazzo with matching kurta. Ideal for office wear.", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800" },
    { title: "Anarkali Suit — Embroidered", price: 1250, moq: 30, category: "Ethnic Wear", fabric: "Georgette", color: "Maroon", gender: "Women",
      desc: "Designer anarkali suit with heavy embroidery. Bridal & festive wear.", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800" },
    { title: "Cotton Saree — Handloom", price: 850, moq: 25, category: "Ethnic Wear", fabric: "Cotton", color: "Yellow", gender: "Women",
      desc: "Traditional handloom cotton saree. Lightweight and breathable.", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800" },
  ],
  // Jaipur Ethnic Fashion
  [
    { title: "Bandhani Dupatta — Red", price: 190, moq: 100, category: "Accessories", fabric: "Cotton", color: "Red", gender: "Women",
      desc: "Traditional Rajasthani Bandhani dupatta. Hand tie-dye work.", img: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800" },
    { title: "Leheriya Saree — Multicolor", price: 980, moq: 20, category: "Ethnic Wear", fabric: "Chiffon", color: "Multi", gender: "Women",
      desc: "Authentic Jaipur Leheriya saree. Festive and wedding wear.", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800" },
    { title: "Block Print Kurta — Men", price: 540, moq: 50, category: "Men's Wear", fabric: "Cotton", color: "Indigo", gender: "Men",
      desc: "Hand block printed kurta for men. Traditional Rajasthani craft.", img: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800" },
    { title: "Quilted Jacket — Women", price: 1150, moq: 40, category: "Winter Wear", fabric: "Cotton", color: "Maroon", gender: "Women",
      desc: "Warm quilted jacket with traditional print. Winter collection.", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800" },
  ],
  // Delhi Garments Co.
  [
    { title: "Denim Jeans — Slim Fit", price: 640, moq: 50, category: "Men's Wear", fabric: "Denim", color: "Blue", gender: "Men",
      desc: "Premium stretch denim jeans. Slim fit, ankle length.", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800" },
    { title: "Formal Shirt — White", price: 420, moq: 75, category: "Men's Wear", fabric: "Cotton", color: "White", gender: "Men",
      desc: "Crisp formal shirt for office wear. Wrinkle-resistant.", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800" },
    { title: "Blazer — Navy Blue", price: 1850, moq: 25, category: "Men's Wear", fabric: "Poly Blend", color: "Navy", gender: "Men",
      desc: "Slim-fit blazer for formal occasions. Imported fabric.", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800" },
    { title: "Chino Pants — Khaki", price: 590, moq: 60, category: "Men's Wear", fabric: "Cotton Twill", color: "Khaki", gender: "Men",
      desc: "Comfortable chinos for casual and semi-formal wear.", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800" },
  ],
  // Ludhiana Knitwear
  [
    { title: "Kids T-Shirt — Bundle of 5", price: 450, moq: 200, category: "Kids Wear", fabric: "Cotton", color: "Multi", gender: "Kids",
      desc: "Pack of 5 colorful kids t-shirts. Soft cotton, breathable.", img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800" },
    { title: "Hoodie — Unisex", price: 780, moq: 50, category: "Winter Wear", fabric: "Fleece", color: "Grey", gender: "Unisex",
      desc: "Warm fleece hoodie for men and women. Winter essential.", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800" },
    { title: "Track Pants — Sports", price: 320, moq: 150, category: "Sports Wear", fabric: "Polyester", color: "Black", gender: "Men",
      desc: "Moisture-wicking track pants for gym and sports.", img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800" },
    { title: "Sweatshirt — Printed", price: 680, moq: 60, category: "Winter Wear", fabric: "Cotton Blend", color: "Charcoal", gender: "Unisex",
      desc: "Graphic printed sweatshirt. Warm and stylish.", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800" },
  ],
  // Mumbai Cotton Mills
  [
    { title: "Cotton Nightwear Set", price: 480, moq: 80, category: "Night Wear", fabric: "Cotton", color: "Blue", gender: "Women",
      desc: "Comfortable 2-piece nightwear set. Breathable cotton.", img: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800" },
    { title: "Polo T-Shirt — Men", price: 380, moq: 100, category: "Men's Wear", fabric: "Cotton Pique", color: "Green", gender: "Men",
      desc: "Classic polo collar t-shirt. Perfect for casual wear.", img: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800" },
    { title: "Cotton Leggings — Pack of 3", price: 390, moq: 120, category: "Women's Wear", fabric: "Cotton Lycra", color: "Assorted", gender: "Women",
      desc: "Pack of 3 comfortable cotton leggings. All sizes available.", img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800" },
    { title: "Dhoti Kurta Set — Traditional", price: 890, moq: 40, category: "Ethnic Wear", fabric: "Cotton Silk", color: "Cream", gender: "Men",
      desc: "Traditional dhoti kurta set for festivals and weddings.", img: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800" },
  ],
];

async function main() {
  console.log("🚀 Starting seed...\n");

  // Check env
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY missing in .env.local");
    process.exit(1);
  }

  const createdManufacturers = [];

  for (const m of manufacturers) {
    console.log(`Creating manufacturer: ${m.business_name}...`);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: m.email,
      password: m.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes("already")) {
        console.log(`  ⚠  Already exists — fetching...`);
        // Find user by email
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list?.users?.find((u) => u.email === m.email);
        if (existing) {
          createdManufacturers.push({ id: existing.id, ...m });
        }
        continue;
      }
      console.error(`  ❌ Auth error:`, authError.message);
      continue;
    }

    const userId = authData.user.id;

    // Upsert profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        role: m.role,
        business_name: m.business_name,
        city: m.city,
        is_verified: m.is_verified,
      });

    if (profileError) {
      console.error(`  ❌ Profile error:`, profileError.message);
      continue;
    }

    createdManufacturers.push({ id: userId, ...m });
    console.log(`  ✅ Created: ${m.business_name}`);
  }

  console.log(`\n📦 Creating products...\n`);

  for (let i = 0; i < createdManufacturers.length; i++) {
    const mfr = createdManufacturers[i];
    const prods = productsByManufacturer[i] || [];

    for (const p of prods) {
      const { error } = await supabase.from("products").insert({
        manufacturer_id: mfr.id,
        title: p.title,
        description: p.desc,
        category: p.category,
        fabric: p.fabric,
        color: p.color,
        gender: p.gender,
        price: p.price,
        moq: p.moq,
        media_urls: [p.img],
        visibility: "verified_retailers",
      });

      if (error) {
        console.error(`  ❌ ${p.title}:`, error.message);
      } else {
        console.log(`  ✅ ${p.title}`);
      }
    }
  }

  console.log("\n======================================================");
  console.log("  ✅ Seed complete!");
  console.log("======================================================");
  console.log(`\n  Manufacturers: ${createdManufacturers.length}`);
  console.log(`  Products: ${createdManufacturers.length * 4}`);
  console.log("");
  console.log("  Demo login (any manufacturer):");
  console.log("    Email: demo.surat.textiles@retailersclub.com");
  console.log("    Password: Demo@12345");
  console.log("");
  console.log("  Open: http://localhost:3000/feed");
  console.log("");
}

main().catch(console.error);
