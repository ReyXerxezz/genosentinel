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

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'NO_ESPECIFICADO';
  status: 'Activo' | 'Seguimiento' | 'Inactivo';
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'NO_ESPECIFICADO';
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {
  status?: 'Activo' | 'Seguimiento' | 'Inactivo';
}

export const patientsApi = {
  async getAll(): Promise<Patient[]> {
    const response = await apiClient.get<ApiResponse<Patient[]>>('/clinica/patients');
    return response.data;
  },

  async getById(id: string): Promise<Patient> {
    const response = await apiClient.get<ApiResponse<Patient>>(`/clinica/patients/${id}`);
    return response.data;
  },

  async create(patient: CreatePatientDto): Promise<Patient> {
    const response = await apiClient.post<ApiResponse<Patient>>('/clinica/patients', patient);
    return response.data;
  },

  async update(id: string, patient: UpdatePatientDto): Promise<Patient> {
    const response = await apiClient.put<ApiResponse<Patient>>(`/clinica/patients/${id}`, patient);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/clinica/patients/${id}`);
  }
};