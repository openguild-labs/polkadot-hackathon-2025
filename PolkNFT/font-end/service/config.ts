class CreateApi {
  private baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    // const isFormData = options.body instanceof FormData;
    const response = await fetch(this.baseURL + url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("check", await response.json())

    if (response.status === 401) {
      window.location.reload();
    }

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        statusCode: response.status,
        message: error.message || "Something went wrong",
        error: error.error,
        metadata: null,
      } as T;
    }

    return await response.json();
  }

  async GET<T>(url: string) {
    return this.request<T>(url, {
      method: "GET",
    });
  }

  async POST<T>(url: string, data?: any) {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async PUT<T>(url: string, data: any) {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async PATCH<T>(url: string, data?: any) {
    return this.request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async DELETE<T>(url: string) {
    return this.request<T>(url, {
      method: "DELETE",
    });
  }

  async UPLOAD<T>(url: string, data: FormData) {
    return this.request<T>(url, {
      method: "POST",
      body: data,
      headers: {},
    });
  }
}

const API = new CreateApi();

export default API;

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  error?: string | object;
  metadata: T;
};

export type TPagination = {
  total: number;
  sort: string;
  sortBy: string;
  page: number;
  limit: number;

  [key: string]: any;
};
