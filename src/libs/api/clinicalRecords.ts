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
    const response = await apiClient.get<ApiResponse<ClinicalRecord[]>>('/clinica/clinical-records');
    return response.data;
  },

  async getById(id: string): Promise<ClinicalRecord> {
    const response = await apiClient.get<ApiResponse<ClinicalRecord>>(`/clinica/clinical-records/${id}`);
    return response.data;
  },

  async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
    const response = await apiClient.get<ApiResponse<ClinicalRecord[]>>(`/clinica/patients/${patientId}/clinical-records`);
    return response.data;
  },

  async create(record: Omit<ClinicalRecord, 'id'>): Promise<ClinicalRecord> {
    const response = await apiClient.post<ApiResponse<ClinicalRecord>>('/clinica/clinical-records', record);
    return response.data;
  },

  async update(id: string, record: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
    const response = await apiClient.put<ApiResponse<ClinicalRecord>>(`/clinica/clinical-records/${id}`, record);
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/clinica/clinical-records/${id}`);
  }
};