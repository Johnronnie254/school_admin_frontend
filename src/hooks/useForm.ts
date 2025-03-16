import { useState, useCallback, ChangeEvent } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));

      if (validate) {
        const validationErrors = validate(values);
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name as keyof T],
        }));
      }
    },
    [values, validate]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setErrors({});
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message } as Partial<Record<keyof T, string>>);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValue,
  };
};

export default useForm; 