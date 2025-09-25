import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../../utils/api';
import { parseMarkdown } from '../../utils/markdown';
import styles from './Post.module.css';

function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postData, relatedData] = await Promise.all([
        blogAPI.getPostBySlug(slug),
        blogAPI.getRelatedPosts(slug, 3),
      ]);
      setPost(postData);
      setRelatedPosts(relatedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.error}>
        <h1>Post Not Found</h1>
        <p>{error || "The blog post you're looking for doesn't exist."}</p>
        <Link to="/news" className={styles.backButton}>
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.postPage}>
      <div className="container">
        <article className={styles.article}>
          {/* Back link */}
          <Link to="/news" className={styles.backLink}>
            ← Back to Blog
          </Link>

          {/* Header */}
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <div className={styles.author}>
                By {post.author?.name || 'ENW Team'}
              </div>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>{post.readingTime} min read</span>
              <span>{post.views} views</span>
            </div>
            {post.category && (
              <Link
                to={`/news?category=${post.category.slug}`}
                className={styles.categoryBadge}
              >
                {post.category.name}
              </Link>
            )}
          </header>

          {/* Featured image */}
          {post.featuredImage && (
            <div className={styles.featuredImage}>
              <img src={post.featuredImage} alt={post.title} />
            </div>
          )}

          {/* Content */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: post.contentHtml || parseMarkdown(post.content),
            }}
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className={styles.tags}>
              <span className={styles.tagsLabel}>Tags:</span>
              {post.tags.map((tag) => (
                <Link key={tag} to={`/news?tag=${tag}`} className={styles.tag}>
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className={styles.relatedPosts}>
              <h3>Related Posts</h3>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost._id} className={styles.relatedCard}>
                    <h4>
                      <Link to={`/news/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h4>
                    <p>{relatedPost.excerpt}</p>
                    <span className={styles.readTime}>
                      {relatedPost.readingTime} min read
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

export default Post;
