import React from "react";

interface DjInfoProps {
  dj: {
    id: string;
    name: string;
    email: string;
  };
}

const DjInfo: React.FC<DjInfoProps> = ({ dj }) => {
  return (
    <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
      <p>
        <strong className="font-semibold">DJ Seleccionat:</strong> {dj.name}
      </p>
      <p>
        <strong className="font-semibold">Email:</strong> {dj.email}
      </p>
    </div>
  );
};

export default DjInfo;
