import { AuthContainerProps } from "~/utils/Interfaces";

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="">
      <div className="w-full max-w-md p-6 space-y-6 bg-gray-800 rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
}
