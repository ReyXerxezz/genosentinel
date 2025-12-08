import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { MainLayout } from '../components/templates/MainLayout';
import PatientsModule from '../pages/patients';
import ClinicalRecordsModule from '../pages/clinical-records';
import TumorTypesModule from '../pages/tumor-types';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'patients',
        element: <PatientsModule />,
      },
      {
        path: 'clinical-records',
        element: <ClinicalRecordsModule />,
      },
      {
        path: 'tumor-types',
        element: <TumorTypesModule />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);