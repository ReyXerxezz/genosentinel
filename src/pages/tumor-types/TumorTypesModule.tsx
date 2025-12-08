import React, { useState, useEffect } from 'react';
import { tumorTypesApi } from '../../libs/api';
import type { TumorType, CreateTumorTypeDto } from '../../types';
import { useModal } from '../../hooks/useModal';
import { DataTable } from '../../components/organisms/DataTable';
import { TumorTypeForm } from '../../components/organisms/TumorTypeForm';
import { Modal } from '../../components/molecules/Modal';
import { Button } from '../../components/atoms/Button';
import { Spinner } from '../../components/atoms/Spinner';
import type { Column } from '../../components/organisms/DataTable/DataTable.types';

const TumorTypesModule: React.FC = () => {
  const [tumorTypes, setTumorTypes] = useState<TumorType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const modal = useModal<TumorType>();

  useEffect(() => {
    fetchTumorTypes();
  }, []);

  const fetchTumorTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tumorTypesApi.getAll();
      
      console.log('Fetched tumor types:', data); // Debug
      console.log('Is array?', Array.isArray(data)); // Debug
      
      // Validación adicional
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        setError('Formato de datos inválido');
        setTumorTypes([]);
        return;
      }
      
      setTumorTypes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar tipos de tumor';
      setError(errorMessage);
      console.error('Error fetching tumor types:', err);
      setTumorTypes([]); // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    modal.open();
  };
  
  const handleEdit = (tumorType: TumorType) => {
    modal.open(tumorType);
  };
  
  const handleDelete = async (id: number | string) => {
    if (window.confirm('¿Estás seguro de eliminar este tipo de tumor?')) {
      try {
        await tumorTypesApi.delete(id);
        await fetchTumorTypes();
      } catch (err) {
        console.error('Error deleting tumor type:', err);
        alert('Error al eliminar el tipo de tumor');
      }
    }
  };

  const handleSubmit = async (data: CreateTumorTypeDto) => {
    try {
      if (modal.modalData) {
        await tumorTypesApi.update(modal.modalData.id, data);
      } else {
        await tumorTypesApi.create(data);
      }
      modal.close();
      await fetchTumorTypes();
    } catch (err) {
      console.error('Error saving tumor type:', err);
      alert('Error al guardar el tipo de tumor');
    }
  };

  const columns: Column<TumorType>[] = [
    { 
      key: 'name', 
      label: 'Nombre',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchTumorTypes} variant="primary">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tipos de Tumor</h1>
            <p className="text-sm text-gray-500 mt-1">
              Total de tipos: {tumorTypes.length}
            </p>
          </div>
          <Button onClick={handleCreate} size="lg" variant="primary">
            + Nuevo Tipo
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        {tumorTypes.length === 0 ? (
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
              />
            </svg>
            <p className="mt-4 text-gray-500">No hay tipos de tumor registrados</p>
            <Button onClick={handleCreate} variant="primary" className="mt-4">
              Crear primer tipo
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tumorTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.modalData ? 'Editar Tipo de Tumor' : 'Nuevo Tipo de Tumor'}
        size="lg"
      >
        <TumorTypeForm
          initialData={modal.modalData}
          onSubmit={handleSubmit}
          onCancel={modal.close}
        />
      </Modal>
    </div>
  );
};

export default TumorTypesModule;