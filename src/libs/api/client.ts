const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  statusText: string;
  url: string;
  body: any;

  constructor(status: number, statusText: string, url: string, body: any, message?: string) {
    super(message ?? statusText);
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.body = body;
  }
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = DEFAULT_API_BASE_URL) {
    // Normalize to avoid double slashes when concatenating endpoints
    this.baseURL = baseURL.replace(/\/+$/, '');
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;
    const url = `${this.baseURL}${normalizedEndpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        credentials: options?.credentials ?? 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Unknown error', 
          message: response.statusText 
        }));

        // Si estamos autenticados y llega 401 en rutas protegidas, redirigimos a login
        if (response.status === 401) {
          const path = window.location?.pathname || '';
          const isAuthPath = path === '/' || path.startsWith('/login') || path.startsWith('/register');
          if (!isAuthPath) {
            console.warn('401 detectado, redirigiendo a login');
            window.location.assign('/');
          }
        }
        
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url,
          error: errorData
        });
        
        throw new ApiError(
          response.status,
          response.statusText,
          url,
          errorData,
          errorData.message || errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('API Response:', { url, data }); // Debug log
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();