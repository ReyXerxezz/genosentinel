interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
}

export interface PatientFormProps {
  initialData?: Patient | null;
  onSubmit: (data: Omit<Patient, 'id' | 'status'>) => void;
  onCancel: () => void;
}