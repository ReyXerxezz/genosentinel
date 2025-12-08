import type { DataTableProps } from "./DataTable.types";

export const DataTable = <T extends { id: string | number }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete 
}: DataTableProps<T>) => {
  // Validación: asegurarse de que data sea un array
  if (!Array.isArray(data)) {
    console.error('DataTable: data debe ser un array, recibido:', typeof data, data);
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Error de formato de datos
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              Los datos recibidos no son un array válido.
            </p>
            <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // Si el array está vacío
  if (data.length === 0) {
    return (
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
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
        <p className="mt-4 text-gray-500">No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th 
                key={String(col.key)} 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td 
                  key={String(col.key)} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {col.render 
                    ? col.render(row[col.key], row) 
                    : String(row[col.key] ?? '-')
                  }
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onEdit(row)} 
                  className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(row.id)} 
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};