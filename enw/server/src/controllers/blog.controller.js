// src/controllers/blog.controller.js
import BlogPost from "../models/blogPost.model.js";
import BlogCategory from "../models/blogCategory.model.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import { parseMarkdown, extractExcerpt } from "../utils/markdown.js";
import logger from "../utils/logger.js";

// ============================
// Public endpoints
// ============================
export const getPosts = catchAsync(async (req, res) => {
  // TEMP: prove handler is reached and can reply (only when &__debug=1)
  if (req.query.__debug === "1") {
    return res.status(200).json({ ok: true, from: "getPosts", ts: Date.now() });
  }

  // Debug: log request
  logger.info("[BLOG] getPosts HIT", {
    url: req.originalUrl,
    query: req.query,
  });

  const {
    status = "published",
    category,
    tag,
    search,
    limit = 10,
    offset = 0,
    sort = "-publishedAt",
  } = req.query;

  // Safe numeric parsing
  const limitNum = Math.max(parseInt(limit, 10) || 10, 0);
  const offsetNum = Math.max(parseInt(offset, 10) || 0, 0);

  // status=ANY disables status filter (default still "published")
  const filter = {};
  const statusNorm = String(status).toLowerCase();
  if (statusNorm !== "any") {
    filter.status = statusNorm; // e.g., "published", "draft"
  }

  // Category by slug -> ObjectId
  if (category) {
    const cat = await BlogCategory.findOne({ slug: category });
    if (cat) {
      filter.category = cat._id;
    } else {
      logger.info("[BLOG] getPosts RESULT (bad category slug)", {
        category,
        total: 0,
        returned: 0,
      });
      return res.json({
        success: true,
        data: [],
        total: 0,
        limit: limitNum,
        offset: offsetNum,
      });
    }
  }

  // Tag filter
  if (tag) {
    filter.tags = { $in: [tag] };
  }

  // Simple search on title/excerpt/tags
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Light debug
  logger.debug?.("[BLOG] getPosts filter", {
    filter,
    sort,
    limit: limitNum,
    offset: offsetNum,
  });

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .populate("category", "name slug")
      .select("-content -contentHtml")
      .sort(sort)
      .skip(offsetNum)
      .limit(limitNum),
    BlogPost.countDocuments(filter),
  ]);

  logger.info("[BLOG] getPosts RESULT", {
    total,
    returned: posts?.length ?? 0,
  });

  // Always 200 + JSON
  return res.json({
    success: true,
    data: posts,
    total,
    limit: limitNum,
    offset: offsetNum,
  });
});

export const getPostBySlug = catchAsync(async (req, res) => {
  // TEMP: prove handler is reached and can reply (only when &__debug=1)
  if (req.query.__debug === "1") {
    return res.status(200).json({
      ok: true,
      from: "getPostBySlug",
      slug: req.params.slug,
      ts: Date.now(),
    });
  }

  logger.info("[BLOG] getPostBySlug HIT", {
    url: req.originalUrl,
    params: req.params,
  });

  const { slug } = req.params;

  const post = await BlogPost.findOne({
    slug,
    status: "published",
  }).populate("category", "name slug");

  if (!post) {
    logger.info("[BLOG] getPostBySlug MISS", { slug });
    throw new AppError("Post not found", 404);
  }

  // Increment view count
  post.views += 1;
  await post.save();

  logger.info("[BLOG] getPostBySlug OK", { slug, views: post.views });

  return res.json({
    success: true,
    data: post,
  });
});

export const getRelatedPosts = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const { limit = 3 } = req.query;

  const limitNum = Math.max(parseInt(limit, 10) || 3, 0);

  const currentPost = await BlogPost.findOne({ slug });

  if (!currentPost) {
    throw new AppError("Post not found", 404);
  }

  const relatedPosts = await BlogPost.find({
    _id: { $ne: currentPost._id },
    status: "published",
    $or: [
      { category: currentPost.category },
      { tags: { $in: currentPost.tags } },
    ],
  })
    .select("title slug excerpt publishedAt readingTime")
    .sort("-publishedAt")
    .limit(limitNum);

  return res.json({
    success: true,
    data: relatedPosts,
  });
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await BlogCategory.find({ isActive: true }).sort(
    "order name"
  );

  // Get post count for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await BlogPost.countDocuments({
        category: cat._id,
        status: "published",
      });

      return {
        ...cat.toObject(),
        postCount: count,
      };
    })
  );

  return res.json({
    success: true,
    data: categoriesWithCount,
    total: categoriesWithCount.length,
  });
});

export const getTags = catchAsync(async (req, res) => {
  const tags = await BlogPost.aggregate([
    { $match: { status: "published" } },
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);

  return res.json({
    success: true,
    data: tags.map((t) => ({ name: t._id, count: t.count })),
    total: tags.length,
  });
});

// ============================
// Admin endpoints (protected - add auth middleware in routes)
// ============================
export const createPost = catchAsync(async (req, res) => {
  const { content, ...postData } = req.body;

  // Parse markdown to HTML
  const contentHtml = parseMarkdown(content);

  // Generate excerpt if not provided
  if (!postData.excerpt) {
    postData.excerpt = extractExcerpt(content, 200);
  }

  const post = await BlogPost.create({
    ...postData,
    content,
    contentHtml,
  });

  logger.info(`New blog post created: ${post.slug}`);

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
});

export const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { content, ...updateData } = req.body;

  const post = await BlogPost.findById(id);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Update content and HTML if content provided
  if (content) {
    updateData.content = content;
    updateData.contentHtml = parseMarkdown(content);

    if (!updateData.excerpt) {
      updateData.excerpt = extractExcerpt(content, 200);
    }
  }

  Object.assign(post, updateData);
  await post.save();

  logger.info(`Blog post updated: ${post.slug}`);

  return res.json({
    success: true,
    message: "Post updated successfully",
    data: post,
  });
});

export const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const post = await BlogPost.findByIdAndDelete(id);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  logger.info(`Blog post deleted: ${post.slug}`);

  return res.json({
    success: true,
    message: "Post deleted successfully",
  });
});

export const createCategory = catchAsync(async (req, res) => {
  const category = await BlogCategory.create(req.body);

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});
