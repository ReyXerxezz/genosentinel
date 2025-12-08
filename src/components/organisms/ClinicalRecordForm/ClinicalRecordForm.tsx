import React, { useState, useEffect } from 'react';
import { FormField } from '../../molecules/FormField';
import { Button } from '../../atoms/Button';
import type { ClinicalRecordFormProps, ClinicalRecordFormData } from './ClinicalRecordForm.types';

export const ClinicalRecordForm: React.FC<ClinicalRecordFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<ClinicalRecordFormData>({
    patientId: initialData?.patientId || '',
    tumorTypeId: initialData?.tumorTypeId || 0,
    diagnosisDate: initialData?.diagnosisDate || new Date().toISOString().split('T')[0],
    stage: initialData?.stage || '',
    treatmentProtocol: initialData?.treatmentProtocol || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClinicalRecordFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        patientId: initialData.patientId,
        tumorTypeId: initialData.tumorTypeId,
        diagnosisDate: initialData.diagnosisDate,
        stage: initialData.stage,
        treatmentProtocol: initialData.treatmentProtocol,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'tumorTypeId' ? Number(value) : value 
    }));
    if (errors[name as keyof ClinicalRecordFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ClinicalRecordFormData, string>> = {};

    if (!formData.patientId || formData.patientId.trim() === '') {
      newErrors.patientId = 'El ID del paciente es requerido';
    }
    if (!formData.tumorTypeId || formData.tumorTypeId === 0) {
      newErrors.tumorTypeId = 'Debe seleccionar un tipo de tumor';
    }
    if (!formData.diagnosisDate) {
      newErrors.diagnosisDate = 'La fecha de diagnóstico es requerida';
    }
    if (!formData.stage.trim()) {
      newErrors.stage = 'El estado es requerido';
    }
    if (!formData.treatmentProtocol.trim()) {
      newErrors.treatmentProtocol = 'El protocolo de tratamiento es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        label="ID del Paciente"
        name="patientId"
        type="text"
        value={formData.patientId}
        onChange={handleChange}
        error={errors.patientId}
        required
        placeholder="Ingrese el ID del paciente"
      />
      
      <FormField
        label="Tipo de Tumor"
        name="tumorTypeId"
        type="number"
        value={String(formData.tumorTypeId)}
        onChange={handleChange}
        error={errors.tumorTypeId}
        required
        placeholder="ID del tipo de tumor"
      />
      
      <FormField
        label="Fecha de Diagnóstico"
        name="diagnosisDate"
        type="date"
        value={formData.diagnosisDate}
        onChange={handleChange}
        error={errors.diagnosisDate}
        required
      />
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Estado <span className="text-red-500">*</span>
        </label>
        <select
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccione un estado</option>
          <option value="I">Estado I</option>
          <option value="II">Estado II</option>
          <option value="III">Estado III</option>
          <option value="IV">Estado IV</option>
        </select>
        {errors.stage && (
          <p className="text-sm text-red-600 mt-1">{errors.stage}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Protocolo de Tratamiento <span className="text-red-500">*</span>
        </label>
        <textarea
          name="treatmentProtocol"
          value={formData.treatmentProtocol}
          onChange={handleChange}
          placeholder="Describa el protocolo de tratamiento"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.treatmentProtocol && (
          <p className="text-sm text-red-600 mt-1">{errors.treatmentProtocol}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Actualizar' : 'Crear'} Registro
        </Button>
      </div>
    </div>
  );
};