import { TumorType } from '../../../types';

export interface TumorTypeFormData {
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TumorTypeFormProps {
  initialData?: TumorType | null;
  onSubmit: (data: TumorTypeFormData) => void | Promise<void>;
  onCancel: () => void;
}