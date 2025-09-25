import "dotenv/config";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

// Core models
import Senior from "../models/senior.model.js";
import Volunteer from "../models/volunteer.model.js";
import Partner from "../models/partner.model.js";
import SupportRequest from "../models/supportRequest.model.js";

// Blog models + utils
import BlogPost from "../models/blogPost.model.js";
import BlogCategory from "../models/blogCategory.model.js";
import { parseMarkdown } from "../utils/markdown.js";

// Blog categories
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

// Blog posts
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

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log("🚀 Starting seed process...");

    // Clear existing data
    await Promise.all([
      Senior.deleteMany({}),
      Volunteer.deleteMany({}),
      Partner.deleteMany({}),
      SupportRequest.deleteMany({}),
      BlogCategory.deleteMany({}),
      BlogPost.deleteMany({}),
    ]);
    console.log("🧹 Cleared existing data");

    // Seed Seniors
    const seniors = Array.from({ length: 20 }).map(() => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      age: faker.number.int({ min: 65, max: 95 }),
      address: faker.location.streetAddress() + ", Vancouver",
      emergencyContact: faker.person.fullName(),
      emergencyPhone: faker.phone.number(),
      healthConditions: faker.lorem.sentence(),
      preferredTimes: faker.helpers.arrayElement([
        "morning",
        "afternoon",
        "evening",
        "flexible",
      ]),
      additionalInfo: faker.lorem.paragraph(),
      consent: true,
    }));
    const seniorDocs = await Senior.insertMany(seniors);
    console.log(`✅ Seeded ${seniorDocs.length} seniors`);

    // Seed Volunteers
    const skills = [
      "SHOPPING",
      "TRANSPORTATION",
      "COMPANIONSHIP",
      "HOUSEWORK",
      "MEDICATION",
      "TECHNOLOGY",
    ];
    const availability = [
      "weekday-morning",
      "weekday-afternoon",
      "weekday-evening",
      "weekend-morning",
      "weekend-afternoon",
    ];

    const volunteers = Array.from({ length: 30 }).map(() => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      age: faker.number.int({ min: 18, max: 70 }),
      address: faker.location.streetAddress() + ", Vancouver",
      occupation: faker.person.jobTitle(),
      skills: faker.helpers.arrayElements(skills, { min: 2, max: 4 }),
      availability: faker.helpers.arrayElements(availability, {
        min: 2,
        max: 3,
      }),
      experience: faker.lorem.paragraph(),
      motivation: faker.lorem.paragraph(),
      references: faker.lorem.sentence(),
      emergencyContact: faker.person.fullName(),
      emergencyPhone: faker.phone.number(),
      backgroundCheck: true,
      status: faker.helpers.arrayElement([
        "ACTIVE",
        "PENDING_VERIFICATION",
        "ACTIVE",
        "ACTIVE",
      ]),
      consent: true,
    }));
    await Volunteer.insertMany(volunteers);
    console.log(`✅ Seeded ${volunteers.length} volunteers`);

    // Seed Partners
    const orgTypes = [
      "HEALTHCARE",
      "PHARMACY",
      "GROCERY",
      "BUSINESS",
      "NONPROFIT",
    ];
    const partners = Array.from({ length: 10 }).map(() => ({
      organizationName: faker.company.name(),
      contactPerson: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      website: faker.internet.url(),
      organizationType: faker.helpers.arrayElement(orgTypes),
      address: faker.location.streetAddress() + ", Vancouver",
      partnershipType: faker.helpers.arrayElement([
        "sponsorship",
        "service",
        "referral",
        "volunteer",
      ]),
      services: faker.lorem.paragraph(),
      targetAudience: faker.lorem.sentence(),
      experience: faker.lorem.paragraph(),
      goals: faker.lorem.paragraph(),
      resources: faker.lorem.sentence(),
      timeline: faker.helpers.arrayElement([
        "immediate",
        "short",
        "medium",
        "long",
      ]),
      additionalInfo: faker.lorem.paragraph(),
      consent: true,
      isActive: true,
    }));
    await Partner.insertMany(partners);
    console.log(`✅ Seeded ${partners.length} partners`);

    // Seed Support Requests
    const supportTypes = [
      "SHOPPING",
      "TRANSPORTATION",
      "COMPANIONSHIP",
      "HOUSEWORK",
      "MEDICATION",
    ];
    for (const senior of seniorDocs.slice(0, 10)) {
      const numRequests = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < numRequests; i++) {
        await SupportRequest.create({
          seniorId: senior._id,
          supportType: faker.helpers.arrayElement(supportTypes),
          description: faker.lorem.paragraph(),
          urgency: faker.helpers.arrayElement(["low", "medium", "high"]),
          preferredDate: faker.date.future(),
          status: faker.helpers.arrayElement([
            "PENDING",
            "ASSIGNED",
            "IN_PROGRESS",
            "COMPLETED",
          ]),
          notes: faker.lorem.sentence(),
        });
      }
    }
    const requestCount = await SupportRequest.countDocuments();
    console.log(`✅ Seeded ${requestCount} support requests`);

    // Seed Blog Categories
    const createdCategories = await BlogCategory.insertMany(categories);
    console.log(`✅ Seeded ${createdCategories.length} blog categories`);

    // Seed Blog Posts
    for (const postData of samplePosts) {
      const category =
        createdCategories[Math.floor(Math.random() * createdCategories.length)];
      const post = new BlogPost({
        ...postData,
        category: category._id,
        contentHtml: parseMarkdown(postData.content),
        author: { name: "ENW Team" },
      });
      await post.save();
    }
    console.log(`✅ Seeded ${samplePosts.length} blog posts`);

    console.log("🎉 Database seeding completed successfully");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

main();
