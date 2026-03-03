/**
 * ════════════════════════════════════════════════════════════════════════════════
 * API CLIENT SERVICE
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * Centralized API client for all backend communication.
 * Handles authentication, error handling, and request/response formatting.
 * 
 * ════════════════════════════════════════════════════════════════════════════════
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  /**
   * Get authorization header
   */
  getAuthHeader() {
    if (!this.token) {
      return {};
    }
    return {
      'Authorization': `Bearer ${this.token}`
    };
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Handle 401 - token expired
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      // Handle 429 - rate limit / subscription limit
      if (response.status === 429) {
        const data = await response.json();
        throw new Error(data.detail?.message || 'Monthly limit exceeded. Please upgrade.');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AUTHENTICATION
  // ─────────────────────────────────────────────────────────────────────────

  async register(name, email, password, subscriptionTier = 'starter') {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        subscription_tier: subscriptionTier
      })
    });

    this.setToken(data.access_token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCORING
  // ─────────────────────────────────────────────────────────────────────────

  async scoreTransaction(transaction) {
    return this.request('/v1/score', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });
  }

  async getHealth() {
    return this.request('/v1/health');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────

  async getDashboardSummary() {
    return this.request('/dashboard/summary');
  }

  async getDashboardFeed(limit = 50) {
    return this.request(`/dashboard/feed?limit=${limit}`);
  }

  async getSubscriptionInfo() {
    return this.request('/dashboard/subscription');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITY
  // ─────────────────────────────────────────────────────────────────────────

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

// Export singleton instance
export const api = new APIClient();

// Export class for testing
export default APIClient;
