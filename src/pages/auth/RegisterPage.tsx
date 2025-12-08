import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../../components/molecules/FormField';
import { Button } from '../../components/atoms/Button';
import { useForm } from '../../hooks/useForm';
import { authApi } from '../../libs/api/auth';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

type Step = 'form' | 'verify';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { values, errors, handleChange, handleSubmit, setErrors, reset } = useForm<RegisterForm>({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.validateToken();
        const detail = res.detail || res.data?.detail;
        if (detail === 'Autenticado') {
          navigate('/app/patients', { replace: true });
        }
      } catch (err) {
        // Ignorar 401 de token inválido o faltante
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (expiresIn === null) return;
    setRemaining(expiresIn);
    const interval = setInterval(() => {
      setRemaining((prev) => (prev === null ? prev : Math.max(prev - 1, 0)));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresIn]);

  const remainingLabel = useMemo(() => {
    if (remaining === null) return null;
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, [remaining]);

  const handleRegister = async (formValues: RegisterForm) => {
    setLoading(true);
    setCodeError(null);
    try {
      const response = await authApi.register(formValues);

      if (response.error_code === 'VALIDATION_ERROR') {
        const validationErrors = response.errors || {};
        const mappedErrors: Record<string, string> = {};
        Object.entries(validationErrors).forEach(([field, msgs]) => {
          mappedErrors[field] = msgs.join(', ');
        });
        setErrors(mappedErrors);
        return;
      }

      if (response.error_code === 'ACCOUNT_ALREADY_VERIFIED') {
        setErrors({ submit: 'Cuenta ya verificada. Inicia sesión.' });
        return;
      }

      const ttl = response.expires_in_seconds ?? response.data?.expires_in_seconds;
      setExpiresIn(ttl ?? null);
      setStep('verify');
    } catch (err) {
      setErrors({ submit: 'No pudimos crear la cuenta. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setCodeError('Ingresa el código.');
      return;
    }

    setLoading(true);
    setCodeError(null);
    try {
      const response = await authApi.verifyCode({ code });

      if (response.error_code) {
        const map: Record<string, string> = {
          CODE_COOKIE_MISSING: 'Sesión de verificación expirada. Repite el registro.',
          CODE_COOKIE_INVALID: 'Sesión de verificación inválida. Repite el registro.',
          CODE_MISMATCH: 'Código incorrecto.',
          CODE_RECORD_MISSING: 'No hay un registro de código vigente.',
          CODE_EXPIRED: 'Código expirado. Solicita uno nuevo.',
        };
        setCodeError(map[response.error_code] ?? 'No pudimos verificar el código.');
        return;
      }

      navigate('/', { replace: true });
    } catch (err) {
      setCodeError('No pudimos verificar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setCodeError(null);
    try {
      const response = await authApi.resendCode();
      const ttl = response.expires_in_seconds ?? response.data?.expires_in_seconds;
      setExpiresIn(ttl ?? null);
      setCode('');
      setRemaining(ttl ?? null);
    } catch (err: any) {
      // Map resend errors
      const map: Record<string, string> = {
        CODE_REFRESH_MISSING: 'Sesión de verificación expirada. Repite el registro.',
        CODE_REFRESH_INVALID: 'Sesión de verificación inválida. Repite el registro.',
        CODE_REFRESH_USER_NOT_FOUND: 'No encontramos tu registro. Repite el registro.',
      };
      const apiErr = (err as any)?.error_code;
      setCodeError(map[apiErr] ?? 'No pudimos reenviar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    reset();
    setStep('form');
    setExpiresIn(null);
    setRemaining(null);
    setCode('');
    setCodeError(null);
  };

  if (step === 'verify') {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            Ingresa el código enviado a tu correo.
          </p>
          {remainingLabel && (
            <p className="text-sm text-gray-500">Expira en: {remainingLabel}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Código</label>
          <input
            type="text"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123456"
          />
          {codeError && <p className="text-sm text-red-600">{codeError}</p>}
        </div>

        <Button type="button" variant="primary" size="md" className="w-full" disabled={loading} onClick={handleVerify}>
          {loading ? 'Verificando...' : 'Verificar código'}
        </Button>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-700 hover:text-blue-900 font-medium"
            disabled={loading}
          >
            Reenviar código
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            Volver a registrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleRegister)}>
      <FormField
        label="Nombre"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Tu nombre"
      />
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
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>

      <p className="text-sm text-gray-600 text-center">
        ¿Ya tienes cuenta?{' '}
        <Link to="/" className="text-blue-700 hover:text-blue-900 font-medium">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
