import { useState, type ChangeEvent, type FormEvent } from 'react';

interface UseFormResult<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e: FormEvent<HTMLFormElement>) => Promise<void>;
  reset: () => void;
  setFieldValue: (name: keyof T, value: T[keyof T]) => void;
  setValues: (values: T) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T
): UseFormResult<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof T]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (onSubmit: (values: T) => Promise<void> | void) => 
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});
      
      try {
        await onSubmit(values);
      } catch (error) {
        if (error instanceof Error) {
          setErrors({ submit: error.message } as Partial<Record<keyof T, string>>);
        }
      }
    };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldValue = (name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    setFieldValue,
    setValues,
    setErrors,
  };
};