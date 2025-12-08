export interface TumorType {
  id: number;
  name: string;
  systemAffected: string; // Campo real del backend
}

export interface CreateTumorTypeDto {
  name: string;
  systemAffected: string; // Campo real del backend
}