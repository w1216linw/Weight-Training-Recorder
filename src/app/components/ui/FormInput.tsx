interface FormInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
}

const FormInput = ({ 
  id, 
  name, 
  type, 
  placeholder, 
  value, 
  onChange, 
  label, 
  required = false 
}: FormInputProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="px-4 py-1 rounded-md text-primary bg-neutral w-full"
      />
    </div>
  );
};

export default FormInput;