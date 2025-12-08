export interface ClinicalRecord {
  id: string;
  patientId: string;
  tumorTypeId: number;
  diagnosisDate: string;
  stage: string;
  treatmentProtocol: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateClinicalRecordDto = Omit<ClinicalRecord, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClinicalRecordDto = Partial<CreateClinicalRecordDto>;