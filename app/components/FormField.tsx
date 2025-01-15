export default function FormField({
  label,
  id,
  name,
  type,
  placeholder,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
  );
}
