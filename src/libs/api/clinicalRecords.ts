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

interface ClinicalRecord {
  id: string;
  patientId: string;
  tumorTypeId: number;
  diagnosisDate: string;
  stage: string;
  treatmentProtocol: string;
}

export const clinicalRecordsApi = {
  async getAll(): Promise<ClinicalRecord[]> {
    const response = await apiClient.get<ApiResponse<ClinicalRecord[]>>('/clinical-records');
    return response.data;
  },

  async getById(id: string): Promise<ClinicalRecord> {
    const response = await apiClient.get<ApiResponse<ClinicalRecord>>(`/clinical-records/${id}`);
    return response.data;
  },

  async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
    const response = await apiClient.get<ApiResponse<ClinicalRecord[]>>(`/patients/${patientId}/clinical-records`);
    return response.data;
  },

  async create(record: Omit<ClinicalRecord, 'id'>): Promise<ClinicalRecord> {
    const response = await apiClient.post<ApiResponse<ClinicalRecord>>('/clinical-records', record);
    return response.data;
  },

  async update(id: string, record: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
    const response = await apiClient.put<ApiResponse<ClinicalRecord>>(`/clinical-records/${id}`, record);
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/clinical-records/${id}`);
  }
};