import React, { useState, useEffect } from 'react';
import { patientsApi } from '../../libs/api';
import type { Patient, CreatePatientDto } from '../../types';
import { useModal } from '../../hooks/useModal';
import { DataTable } from '../../components/organisms/DataTable';
import { PatientForm } from '../../components/organisms/PatientForm';
import { Modal } from '../../components/molecules/Modal';
import { Button } from '../../components/atoms/Button';
import { Spinner } from '../../components/atoms/Spinner';
import type { Column } from '../../components/organisms/DataTable/DataTable.types';

const PatientsModule: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const modal = useModal<Patient>();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pacientes');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    modal.open();
  };
  
  const handleEdit = (patient: Patient) => {
    modal.open(patient);
  };
  
  const handleDelete = async (id: string | number) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      try {
        await patientsApi.delete(String(id));
        await fetchPatients();
      } catch (err) {
        console.error('Error deleting patient:', err);
        alert('Error al eliminar el paciente');
      }
    }
  };

  const handleSubmit = async (data: CreatePatientDto) => {
    try {
      if (modal.modalData) {
        await patientsApi.update(modal.modalData.id, data);
      } else {
        await patientsApi.create(data);
      }
      modal.close();
      await fetchPatients();
    } catch (err) {
      console.error('Error saving patient:', err);
      alert('Error al guardar el paciente');
    }
  };

  const columns: Column<Patient>[] = [
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'Nombre' },
    { key: 'lastName', label: 'Apellido' },
    { 
      key: 'birthDate', 
      label: 'Fecha de Nacimiento',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES')
    },
    { 
      key: 'gender', 
      label: 'Género',
      render: (value: string) => {
        const genderMap: Record<string, string> = {
          MASCULINO: 'Masculino',
          FEMENINO: 'Femenino',
          OTRO: 'Otro',
          NO_ESPECIFICADO: 'No especificado'
        };
        return genderMap[value] || value;
      }
    },
    { 
      key: 'status', 
      label: 'Estado',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Activo' ? 'bg-green-100 text-green-800' :
          value === 'Seguimiento' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
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
          <Button onClick={fetchPatients}>Reintentar</Button>
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
            <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
            <p className="text-sm text-gray-500 mt-1">
              Total de pacientes: {patients.length}
            </p>
          </div>
          <Button onClick={handleCreate} size="lg">
            + Nuevo Paciente
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {patients.length === 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <p className="mt-4 text-gray-500">No hay pacientes registrados</p>
            <Button onClick={handleCreate} variant="primary" className="mt-4">
              Crear primer paciente
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={patients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.modalData ? 'Editar Paciente' : 'Nuevo Paciente'}
        size="lg"
      >
        <PatientForm
          initialData={modal.modalData}
          onSubmit={handleSubmit}
          onCancel={modal.close}
        />
      </Modal>
    </div>
  );
};

export default PatientsModule;