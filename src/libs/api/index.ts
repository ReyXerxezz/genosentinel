export { patientsApi } from './patients';
export { clinicalRecordsApi } from './clinicalRecords';
export { tumorTypesApi } from './tumorTypes';
export { authApi } from './auth';
export type { CreatePatientDto, UpdatePatientDto } from './patients';
// Clinical records currently use implicit types; add exports when DTOs exist
export type { CreateTumorTypeDto, TumorType } from './tumorTypes';
export type { LoginDto, RegisterDto, VerifyCodeDto, AuthTokens } from './auth';
export type { LoginDto, RegisterDto, VerifyCodeDto, AuthTokens } from './auth';