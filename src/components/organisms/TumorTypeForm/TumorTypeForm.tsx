import React, { useState } from 'react';
import type { TumorType, CreateTumorTypeDto } from '../../../types';
import { Button } from '../../atoms/Button';

interface TumorTypeFormProps {
  initialData?: TumorType | null;
  onSubmit: (data: CreateTumorTypeDto) => Promise<void>;
  onCancel: () => void;
}

export const TumorTypeForm: React.FC<TumorTypeFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<CreateTumorTypeDto>({
    name: initialData?.name || '',
    systemAffected: initialData?.systemAffected || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Limpiar error al cambiar datos
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    
    if (!formData.systemAffected.trim()) {
      setError('El sistema afectado es requerido');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      console.log('Submitting form data:', formData); // Debug
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Nombre del Tumor */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Tipo de Tumor *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Carcinoma ductal infiltrante"
          />
          <p className="mt-1 text-xs text-gray-500">
            Nombre específico del tipo de tumor
          </p>
        </div>

        {/* Sistema Afectado */}
        <div>
          <label htmlFor="systemAffected" className="block text-sm font-medium text-gray-700 mb-2">
            Sistema Afectado *
          </label>
          <select
            id="systemAffected"
            name="systemAffected"
            required
            value={formData.systemAffected}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar sistema...</option>
            <option value="Mama">Mama</option>
            <option value="Pulmón">Pulmón</option>
            <option value="Colon">Colon</option>
            <option value="Próstata">Próstata</option>
            <option value="Estómago">Estómago</option>
            <option value="Hígado">Hígado</option>
            <option value="Páncreas">Páncreas</option>
            <option value="Cerebro">Cerebro</option>
            <option value="Piel">Piel</option>
            <option value="Riñón">Riñón</option>
            <option value="Vejiga">Vejiga</option>
            <option value="Tiroides">Tiroides</option>
            <option value="Sangre">Sangre (Leucemia/Linfoma)</option>
            <option value="Huesos">Huesos</option>
            <option value="Sistema nervioso central">Sistema Nervioso Central</option>
            <option value="Tracto gastrointestinal">Tracto Gastrointestinal</option>
            <option value="Sistema reproductivo">Sistema Reproductivo</option>
            <option value="Otros">Otros</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Sistema u órgano principal afectado por el tumor
          </p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};