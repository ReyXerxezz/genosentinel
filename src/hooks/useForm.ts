import { useState, type ChangeEvent, type FormEvent } from 'react';

type FormErrors<T> = Partial<Record<keyof T, string>> & { submit?: string };

interface UseFormResult<T> {
  values: T;
  errors: FormErrors<T>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e: FormEvent<HTMLFormElement>) => Promise<void>;
  reset: () => void;
  setFieldValue: (name: keyof T, value: T[keyof T]) => void;
  setValues: (values: T) => void;
  setErrors: (errors: FormErrors<T>) => void;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T
): UseFormResult<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});

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
          setErrors((prev) => ({ ...prev, submit: error.message }));
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