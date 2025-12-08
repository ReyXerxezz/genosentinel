import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { patientsApi, clinicalRecordsApi, tumorTypesApi } from '../../../libs/api';
import type { MainLayoutProps } from './MainLayout.types';

interface Stats {
  patients: number;
  clinicalRecords: number;
  tumorTypes: number;
  loading: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  const location = useLocation();
  const [stats, setStats] = useState<Stats>({
    patients: 0,
    clinicalRecords: 0,
    tumorTypes: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [patients, records, tumorTypes] = await Promise.all([
        patientsApi.getAll().catch(() => []),
        clinicalRecordsApi.getAll().catch(() => []),
        tumorTypesApi.getAll().catch(() => []),
      ]);

      setStats({
        patients: patients.length,
        clinicalRecords: records.length,
        tumorTypes: tumorTypes.length,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const navigation = [
    { name: 'Pacientes', href: '/patients', icon: '👥' },
    { name: 'Registros Clínicos', href: '/clinical-records', icon: '📋' },
    { name: 'Tipos de Tumor', href: '/tumor-types', icon: '🔬' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Clinical Records
                </h1>
                <p className="text-xs text-gray-500">
                  Sistema de Gestión Clínica
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchStats}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                title="Actualizar estadísticas"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navegación
              </h2>
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Stats Dinámicas */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Estadísticas en tiempo real
                </h3>
                
                {stats.loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/patients"
                      className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-gray-600 group-hover:text-gray-900">
                        Pacientes
                      </span>
                      <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-700">
                        {stats.patients}
                      </span>
                    </Link>
                    
                    <Link
                      to="/clinical-records"
                      className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-gray-600 group-hover:text-gray-900">
                        Registros
                      </span>
                      <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-700">
                        {stats.clinicalRecords}
                      </span>
                    </Link>
                    
                    <Link
                      to="/tumor-types"
                      className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-gray-600 group-hover:text-gray-900">
                        Tipos Tumor
                      </span>
                      <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-700">
                        {stats.tumorTypes}
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Accesos Rápidos
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/patients"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span>➕</span> Nuevo Paciente
                  </Link>
                  <Link
                    to="/clinical-records"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span>📝</span> Nuevo Registro
                  </Link>
                  <Link
                    to="/tumor-types"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span>🔬</span> Nuevo Tipo
                  </Link>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet context={{ refreshStats: fetchStats }} />
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 Clinical Records System. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>
                Versión 1.0.0
              </span>
              <span>•</span>
              <a 
                href="#" 
                className="hover:text-gray-600 transition-colors"
              >
                Documentación
              </a>
              <span>•</span>
              <a 
                href="#" 
                className="hover:text-gray-600 transition-colors"
              >
                Soporte daniel.f.l.r.c@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};