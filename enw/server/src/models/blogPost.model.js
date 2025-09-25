import mongoose from "mongoose";
import slugify from "slugify";

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
    },
    contentHtml: {
      type: String,
    },
    featuredImage: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      name: {
        type: String,
        default: "ENW Team",
      },
      avatar: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      index: true,
    },
    readingTime: {
      type: Number, // in minutes
    },
    views: {
      type: Number,
      default: 0,
    },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
BlogPostSchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });

    // Ensure unique slug
    const existingPost = await this.constructor.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });

    if (existingPost) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }

  // Calculate reading time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Set publishedAt when status changes to published
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Indexes for common queries
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ "author.name": 1 });

export default mongoose.model("BlogPost", BlogPostSchema);
