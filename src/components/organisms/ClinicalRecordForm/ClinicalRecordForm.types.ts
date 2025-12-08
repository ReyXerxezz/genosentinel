import type { ClinicalRecord, CreateClinicalRecordDto } from '../../../types';

export interface ClinicalRecordFormData {
  patientId: string;
  tumorTypeId: number;
  diagnosisDate: string;
  stage: string;
  treatmentProtocol: string;
}

export interface ClinicalRecordFormProps {
  initialData?: ClinicalRecord | null;
  onSubmit: (data: CreateClinicalRecordDto) => void | Promise<void>;
  onCancel: () => void;
}