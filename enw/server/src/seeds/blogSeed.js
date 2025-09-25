// server/src/seeds/blogSeed.js
import "dotenv/config";
import mongoose from "mongoose";
import slugify from "slugify";
import BlogPost from "../models/blogPost.model.js";
import BlogCategory from "../models/blogCategory.model.js";
import { parseMarkdown } from "../utils/markdown.js";

// ---- Claude's content (kept) ----
const categories = [
  {
    name: "Community Stories",
    description: "Heartwarming stories from our community",
  },
  {
    name: "Volunteer Spotlight",
    description: "Highlighting our amazing volunteers",
  },
  { name: "Health & Wellness", description: "Tips for healthy aging" },
  { name: "Program Updates", description: "Latest news about our programs" },
  {
    name: "Resources",
    description: "Helpful resources for seniors and families",
  },
];

const samplePosts = [
  {
    title: "Why Community Support Matters for Seniors",
    content: `
# The Importance of Community

As our communities age, the importance of neighborhood support systems becomes increasingly clear. Social isolation among seniors is not just a personal challenge—it's a community-wide issue that affects health outcomes, quality of life, and the overall wellbeing of our neighborhoods.

## The Challenge of Isolation

Many elderly people find themselves living alone, with limited mobility, and often lacking close community ties. This isolation can lead to:

- Depression and anxiety
- Decline in physical health
- Reduced cognitive function
- Increased risk of premature mortality

## The Power of Neighbors

Our pilot programs have shown that when neighbors step up to help, the impact goes far beyond completing tasks. Regular check-ins, friendly conversations, and shared activities create bonds that benefit both seniors and volunteers.

### Key Benefits Include:
1. **Improved Mental Health**: Regular social interaction reduces depression
2. **Better Physical Health**: Assistance with tasks promotes independence
3. **Stronger Communities**: Intergenerational connections strengthen neighborhoods
4. **Peace of Mind**: Families know their loved ones are supported

## Building Stronger Communities

Community support for seniors creates a ripple effect. When we care for our elderly neighbors, we:
- Set positive examples for younger generations
- Build empathy and understanding across age groups
- Create more resilient, connected neighborhoods
- Reduce strain on healthcare and social services

Join us in making a difference in your community today!
    `,
    tags: ["community", "social-isolation", "mental-health", "volunteering"],
    status: "published",
  },
  {
    title: "How ENW Connects Neighbours Safely and Simply",
    content: `
# Safe and Simple Connections

Safety and trust are the cornerstones of effective community support. At Elderly Neighbour Watch, we've developed a comprehensive system to ensure that every connection between volunteers and seniors is secure, verified, and positive.

## Our Safety Framework

### Volunteer Screening Process
Every volunteer undergoes:
- **Background checks**: Criminal record verification
- **Reference checks**: Contact with provided references
- **Interview process**: Personal assessment of suitability
- **Training completion**: Required safety and communication training

### Digital Platform Security
Our technology platform features:
- Enterprise-grade encryption for all data
- Role-based access controls
- Regular security audits
- GDPR compliance

## Making Connections Simple

Despite our robust security, we've kept the process simple:

1. **Easy Registration**: Simple online forms with clear instructions
2. **Quick Matching**: Automated matching based on location and needs
3. **Clear Communication**: Direct messaging within our secure platform
4. **Ongoing Support**: Coordinators available for any questions

## Trust Through Transparency

We believe in complete transparency:
- Volunteers can see senior's needs clearly
- Seniors know who's coming to help
- Families can track all interactions
- Regular feedback ensures quality

Join our trusted network today and see how simple helping can be!
    `,
    tags: ["safety", "security", "technology", "trust"],
    status: "published",
  },
];
// ---------------------------------

const toSlug = (text) => slugify(text, { lower: true, strict: true });

function mdToPlain(md = "") {
  return md
    .replace(/```[\s\S]*?```/g, " ") // code fences
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ") // images
    .replace(/\[[^\]]*]\([^)]+\)/g, (m) => m.replace(/\[|\]|\([^)]+\)/g, "")) // links -> text
    .replace(/^#{1,6}\s*/gm, "") // headings
    .replace(/[*_~>#-]/g, "") // md symbols
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}
function makeExcerpt(md, len = 180) {
  const plain = mdToPlain(md);
  return plain.length <= len ? plain : plain.slice(0, len).trim() + "…";
}
function calcReadingTime(md) {
  const words = mdToPlain(md).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200)); // ~200 wpm
}

/** Ensure a unique slug on a model by appending -2, -3, ... if needed */
async function ensureUniqueSlug(Model, baseSlug, idToSkip = null) {
  let slug = baseSlug || "item";
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Model.findOne(
      idToSkip ? { slug, _id: { $ne: idToSkip } } : { slug }
    ).lean();
    if (!existing) return slug;
    i += 1;
    slug = `${baseSlug}-${i}`;
  }
}

/** Make indexes correct & backfill slugs for any existing docs (no deletions) */
async function ensureIndexesAndBackfill() {
  // Prefer unique slug for categories
  try {
    await BlogCategory.collection.dropIndex("name_1");
  } catch (_) {}
  try {
    await BlogCategory.collection.createIndex({ slug: 1 }, { unique: true });
  } catch (_) {}
  // Unique slug for posts
  try {
    await BlogPost.collection.createIndex({ slug: 1 }, { unique: true });
  } catch (_) {}

  // Backfill category slugs
  const catsNoSlug = await BlogCategory.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
  });
  for (const c of catsNoSlug) {
    const base = toSlug(c.name || "category");
    c.slug = await ensureUniqueSlug(BlogCategory, base, c._id);
    await c.save();
  }

  // Backfill post slugs + excerpt + readingTime + publishedAt
  const posts = await BlogPost.find({});
  for (const p of posts) {
    let changed = false;
    if (!p.slug) {
      const base = toSlug(p.title || "post");
      p.slug = await ensureUniqueSlug(BlogPost, base, p._id);
      changed = true;
    }
    if (!p.excerpt) {
      p.excerpt = makeExcerpt(p.content || "");
      changed = true;
    }
    if (!p.readingTime) {
      p.readingTime = calcReadingTime(p.content || "");
      changed = true;
    }
    if (!p.publishedAt) {
      p.publishedAt = p.createdAt || new Date();
      changed = true;
    }
    if (changed) await p.save();
  }
}

async function seedBlog() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // 0) Ensure indexes & backfill derived fields for existing docs
    await ensureIndexesAndBackfill();

    // 1) Upsert categories (match by slug OR name), no deletions
    const categoryDocs = [];
    for (const c of categories) {
      const desiredSlug = toSlug(c.name);
      let existing =
        (await BlogCategory.findOne({ slug: desiredSlug })) ||
        (await BlogCategory.findOne({ name: c.name }));

      if (existing) {
        if (!existing.slug) {
          existing.slug = await ensureUniqueSlug(
            BlogCategory,
            desiredSlug,
            existing._id
          );
        }
        existing.name = existing.name || c.name;
        if (c.description && !existing.description)
          existing.description = c.description;
        await existing.save();
        categoryDocs.push(existing);
      } else {
        const unique = await ensureUniqueSlug(BlogCategory, desiredSlug);
        const created = await BlogCategory.create({
          name: c.name,
          description: c.description,
          slug: unique,
        });
        categoryDocs.push(created);
      }
    }
    console.log(`✅ Categories ready: ${categoryDocs.length}`);

    const pickCategoryId = () =>
      categoryDocs[Math.floor(Math.random() * categoryDocs.length)]._id;

    // 2) Upsert posts (match by slug OR title), no deletions
    for (const p of samplePosts) {
      const desiredSlug = toSlug(p.title);
      const excerpt = makeExcerpt(p.content);
      const readingTime = calcReadingTime(p.content);

      let existing =
        (await BlogPost.findOne({ slug: desiredSlug })) ||
        (await BlogPost.findOne({ title: p.title }));

      if (existing) {
        existing.title = p.title;
        existing.content = p.content;
        existing.contentHtml = parseMarkdown(p.content);
        existing.tags = p.tags;
        existing.status = p.status;
        existing.author = existing.author || { name: "ENW Team" };
        existing.category = existing.category || pickCategoryId();
        if (!existing.slug) {
          existing.slug = await ensureUniqueSlug(
            BlogPost,
            desiredSlug,
            existing._id
          );
        }
        // backfill required/derived fields
        if (!existing.excerpt) existing.excerpt = excerpt;
        if (!existing.readingTime) existing.readingTime = readingTime;
        if (!existing.publishedAt)
          existing.publishedAt = existing.createdAt || new Date();

        await existing.save();
        console.log(`✅ Post ready: ${existing.title}`);
      } else {
        const unique = await ensureUniqueSlug(BlogPost, desiredSlug);
        const created = await BlogPost.create({
          title: p.title,
          slug: unique,
          content: p.content,
          contentHtml: parseMarkdown(p.content),
          excerpt, // ✅ required
          readingTime, // ✅ derived
          publishedAt: new Date(), // ✅ sensible default
          tags: p.tags,
          status: p.status,
          category: pickCategoryId(),
          author: { name: "ENW Team" },
        });
        console.log(`✅ Post created: ${created.title}`);
      }
    }

    const { name, host, port } = mongoose.connection;
    console.log(`[SEED DB] name: ${name}  host: ${host}  port: ${port ?? "-"}`);

    console.log("🎉 Blog seeding completed (idempotent, no data removed)");
  } catch (error) {
    console.error("❌ Blog seeding error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
  }
}

seedBlog();
