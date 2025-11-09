
import type { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';

// Định nghĩa props cho component
interface FormInputProps<T extends FieldValues> {
  id: Path<T>;
  label: React.ReactNode; 
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  validationSchema?: object;
  placeholder?: string;
}

export const FormInput = <T extends FieldValues>({
  id,
  label,
  type = 'text',
  register,
  error,
  validationSchema = {},
  placeholder = '',
}: FormInputProps<T>) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, validationSchema)}
        className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};