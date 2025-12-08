// ============================================
// ARCHIVO: src/libs/api/tumorTypes.ts
// ============================================
import { apiClient } from './client';

interface ApiResponse<T> {
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Según tu Swagger, el backend usa estos campos:
export interface TumorType {
  id: number;
  name: string;
  systemAffected: string; // ← Backend usa systemAffected, no category
}

export interface CreateTumorTypeDto {
  name: string;
  systemAffected: string; // ← Backend usa systemAffected, no category
}

export const tumorTypesApi = {
  async getAll(): Promise<TumorType[]> {
    const response = await apiClient.get<ApiResponse<TumorType[]>>('/clinica/tumor-types');
    console.log('Tumor Types API Response:', response); // Debug
    
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data;
    }
    
    if (Array.isArray(response)) {
      return response;
    }
    
    console.error('Unexpected API response format:', response);
    return [];
  },

  async getById(id: number): Promise<TumorType> {
    const response = await apiClient.get<ApiResponse<TumorType>>(`/clinica/tumor-types/${id}`);
    return response.data;
  },

  async create(tumorType: CreateTumorTypeDto): Promise<TumorType> {
    console.log('Creating tumor type with data:', tumorType); // Debug
    const response = await apiClient.post<ApiResponse<TumorType>>('/clinica/tumor-types', tumorType);
    return response.data;
  },

  async update(id: number, tumorType: Partial<CreateTumorTypeDto>): Promise<TumorType> {
    const response = await apiClient.put<ApiResponse<TumorType>>(`/clinica/tumor-types/${id}`, tumorType);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(`/clinica/tumor-types/${id}`);
  }
};
