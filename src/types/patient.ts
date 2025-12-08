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
