const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Blog-specific API methods
class BlogAPI extends ApiClient {
  async getPosts(params = {}) {
    const result = await this.get('/blog/posts', params);
    return result.data;
  }

  async getPostBySlug(slug) {
    const result = await this.get(`/blog/posts/${slug}`);
    return result.data;
  }

  async getRelatedPosts(slug, limit = 3) {
    const result = await this.get(`/blog/posts/${slug}/related`, { limit });
    return result.data;
  }

  async getCategories() {
    const result = await this.get('/blog/categories');
    return result.data;
  }

  async getTags() {
    const result = await this.get('/blog/tags');
    return result.data;
  }
}

export const api = new ApiClient();
export const blogAPI = new BlogAPI();
