import React, { useState, useEffect } from 'react';
import { clinicalRecordsApi } from '../../libs/api';
import type { ClinicalRecord, CreateClinicalRecordDto } from '../../types';
import { useModal } from '../../hooks/useModal';
import { DataTable } from '../../components/organisms/DataTable';
import { ClinicalRecordForm } from '../../components/organisms/ClinicalRecordForm';
import { Modal } from '../../components/molecules/Modal';
import { Button } from '../../components/atoms/Button';
import { Spinner } from '../../components/atoms/Spinner';
import type { Column } from '../../components/organisms/DataTable/DataTable.types';

const ClinicalRecordsModule: React.FC = () => {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const modal = useModal<ClinicalRecord>();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clinicalRecordsApi.getAll();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar registros');
      console.error('Error fetching clinical records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    modal.open();
  };
  
  const handleEdit = (record: ClinicalRecord) => {
    modal.open(record);
  };
  
  const handleDelete = async (id: string | number) => {
    if (window.confirm('¿Estás seguro de eliminar este registro clínico?')) {
      try {
        await clinicalRecordsApi.delete(id);
        await fetchRecords();
      } catch (err) {
        console.error('Error deleting clinical record:', err);
        alert('Error al eliminar el registro');
      }
    }
  };

  const handleSubmit = async (data: CreateClinicalRecordDto) => {
    try {
      if (modal.modalData) {
        await clinicalRecordsApi.update(modal.modalData.id, data);
      } else {
        await clinicalRecordsApi.create(data);
      }
      modal.close();
      await fetchRecords();
    } catch (err) {
      console.error('Error saving clinical record:', err);
      alert('Error al guardar el registro');
    }
  };

  const columns: Column<ClinicalRecord>[] = [
    { key: 'id', label: 'ID' },
    { 
      key: 'patientId', 
      label: 'Paciente ID' 
    },
    { 
      key: 'tumorTypeId', 
      label: 'Tipo de Tumor ID' 
    },
    { 
      key: 'diagnosisDate', 
      label: 'Fecha de Diagnóstico',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES')
    },
    { 
      key: 'stage', 
      label: 'Estado',
      render: (value: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value}
        </span>
      )
    },
    { 
      key: 'treatmentProtocol', 
      label: 'Protocolo de Tratamiento',
      render: (value: string) => (
        <span className="max-w-xs truncate block" title={value}>
          {value}
        </span>
      )
    },
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
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchRecords}>Reintentar</Button>
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
            <h1 className="text-2xl font-bold text-gray-900">Registros Clínicos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Total de registros: {records.length}
            </p>
          </div>
          <Button onClick={handleCreate} size="lg">
            + Nuevo Registro
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {records.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="mt-4 text-gray-500">No hay registros clínicos</p>
            <Button onClick={handleCreate} variant="primary" className="mt-4">
              Crear primer registro
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={records}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.modalData ? 'Editar Registro Clínico' : 'Nuevo Registro Clínico'}
        size="lg"
      >
        <ClinicalRecordForm
          initialData={modal.modalData}
          onSubmit={handleSubmit}
          onCancel={modal.close}
        />
      </Modal>
    </div>
  );
};

export default ClinicalRecordsModule;