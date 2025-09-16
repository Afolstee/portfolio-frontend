const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }
};

// API functions
export const portfolioApi = {
  getProjects: () => apiClient.get('/api/projects'),
  getProject: (id) => apiClient.get(`/api/projects/${id}`),
  trackView: (id, data) => apiClient.post(`/api/projects/${id}/view`, data),
  getSkills: () => apiClient.get('/api/skills'),
  submitContact: (data) => apiClient.post('/api/contact', data),
  getAnalytics: () => apiClient.get('/api/analytics/views'),
};