export default function SubmitButton({ label }: { label: string }) {
    return (
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {label}
      </button>
    );
  }
  