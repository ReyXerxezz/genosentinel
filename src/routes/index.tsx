import { createBrowserRouter, RouteObject, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/templates/MainLayout';
import { PageLayout } from '../components/templates/PageLayout';
import PatientsModule from '../pages/patients';
import ClinicalRecordsModule from '../pages/clinical-records';
import TumorTypesModule from '../pages/tumor-types';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/app',
    element: <MainLayout />,
    children: [
      { path: 'patients', element: <PatientsModule /> },
      { path: 'clinical-records', element: <ClinicalRecordsModule /> },
      { path: 'tumor-types', element: <TumorTypesModule /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

export const router = createBrowserRouter(routes);