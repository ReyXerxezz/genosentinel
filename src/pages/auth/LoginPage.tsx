import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../../components/molecules/FormField';
import { Button } from '../../components/atoms/Button';
import { useForm } from '../../hooks/useForm';
import { authApi } from '../../libs/api/auth';
import { ApiError } from '../../libs/api/client';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { values, errors, handleChange, handleSubmit, setErrors } = useForm<LoginForm>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string, timeout = 3000) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), timeout);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.validateToken();
        const detail = res.detail || res.data?.detail;
        if (detail === 'Autenticado') {
          navigate('/app/patients', { replace: true });
        }
      } catch (err: any) {
        // Ignorar 401 (MISSING_COOKIES, INVALID_ACCESS)
      }
    };

    checkAuth();
  }, [navigate]);

  const onSubmit = async (formValues: LoginForm) => {
    setLoading(true);
    try {
      const response = await authApi.login(formValues);
      if (response.error_code === 'INVALID_CREDENTIALS') {
        setErrors({ submit: 'Credenciales inválidas.' });
        return;
      }

      if (response.error_code === 'ACCOUNT_NOT_VERIFIED') {
        setErrors({ submit: 'Cuenta no verificada. Revisa tu correo.' });
        return;
      }

      const detail = response.detail || response.message || 'Inicio de sesión exitoso.';
      showAlert('success', detail);
      setTimeout(() => navigate('/app/patients', { replace: true }), 800);
    } catch (err: any) {
      if (err instanceof ApiError) {
        const code = err.body?.error_code;
        const detail = err.body?.detail || err.message;
        if (code === 'INVALID_CREDENTIALS') {
          setErrors({ submit: 'Credenciales inválidas.' });
          return;
        }
        if (code === 'ACCOUNT_NOT_VERIFIED') {
          setErrors({ submit: 'Cuenta no verificada. Revisa tu correo.' });
          return;
        }
        setErrors({ submit: 'No pudimos iniciar sesión. Intenta de nuevo.' });
      } else {
        setErrors({ submit: 'No pudimos iniciar sesión. Intenta de nuevo.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {alert && (
        <div
          className={`rounded-lg border px-3 py-2 text-sm ${
            alert.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {alert.message}
        </div>
      )}
      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        required
        placeholder="correo@ejemplo.com"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        required
        placeholder="********"
      />

      {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

      <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </Button>

      <p className="text-sm text-gray-600 text-center">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-blue-700 hover:text-blue-900 font-medium">
          Regístrate
        </Link>
      </p>
    </form>
  );
};

export default LoginPage;
