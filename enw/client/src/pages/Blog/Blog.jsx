// client/src/pages/Blog/Blog.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hero from '../../components/ui/Hero/Hero';
import { blogAPI } from '../../utils/api';
import styles from './Blog.module.css';

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 9,
    offset: 0,
  });

  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    loadData();
  }, [category, tag, page]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * pagination.limit;

      const [postsData, categoriesData, tagsData] = await Promise.all([
        blogAPI.getPosts({ category, tag, limit: pagination.limit, offset }),
        blogAPI.getCategories(),
        blogAPI.getTags(),
      ]);

      setPosts(postsData.data || []); // API returns { data, total }
      setCategories(categoriesData);
      setTags(tagsData);

      setPagination((prev) => ({
        ...prev,
        total: postsData.total || 0,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categorySlug) => {
    searchParams.set('category', categorySlug);
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const handleTagFilter = (tagName) => {
    searchParams.set('tag', tagName);
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading blog posts: {error}</p>
        <button onClick={loadData}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <Hero
        title="News & Updates"
        description="Stay informed about our community impact, volunteer stories, and the latest developments in elderly care."
        variant="compact"
      />

      <section className={styles.blogSection}>
        <div className="container">
          <div className={styles.blogLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              {/* Categories */}
              <div className={styles.widget}>
                <h3>Categories</h3>
                <ul className={styles.categoryList}>
                  <li>
                    <button
                      onClick={clearFilters}
                      className={!category && !tag ? styles.active : ''}
                    >
                      All Posts
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        onClick={() => handleCategoryFilter(cat.slug)}
                        className={category === cat.slug ? styles.active : ''}
                      >
                        {cat.name} ({cat.postCount})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className={styles.widget}>
                <h3>Popular Tags</h3>
                <div className={styles.tagCloud}>
                  {tags.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => handleTagFilter(t.name)}
                      className={`${styles.tag} ${tag === t.name ? styles.active : ''}`}
                    >
                      {t.name} ({t.count})
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Posts Grid */}
            <main className={styles.mainContent}>
              {posts.length === 0 ? (
                <p className={styles.noPosts}>No posts found.</p>
              ) : (
                <>
                  <div className={styles.postsGrid}>
                    {posts.map((post) => (
                      <article key={post._id} className={styles.postCard}>
                        {post.featuredImage && (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className={styles.postImage}
                          />
                        )}
                        <div className={styles.postContent}>
                          <div className={styles.postMeta}>
                            <time dateTime={post.publishedAt}>
                              {new Date(post.publishedAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </time>
                            {post.category && (
                              <>
                                <span>•</span>
                                <span className={styles.category}>
                                  {post.category.name}
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span>{post.readingTime} min read</span>
                          </div>

                          <h2 className={styles.postTitle}>
                            <Link to={`/news/${post.slug}`}>{post.title}</Link>
                          </h2>

                          <p className={styles.postExcerpt}>{post.excerpt}</p>

                          <Link
                            to={`/news/${post.slug}`}
                            className={styles.readMore}
                          >
                            Read more →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        onClick={() => {
                          searchParams.set('page', page - 1);
                          setSearchParams(searchParams);
                        }}
                        disabled={page === 1}
                        className={styles.pageButton}
                      >
                        Previous
                      </button>

                      <span className={styles.pageInfo}>
                        Page {page} of {totalPages}
                      </span>

                      <button
                        onClick={() => {
                          searchParams.set('page', page + 1);
                          setSearchParams(searchParams);
                        }}
                        disabled={page === totalPages}
                        className={styles.pageButton}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Blog;
