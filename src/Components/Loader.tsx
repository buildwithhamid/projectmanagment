import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-t-transparent border-blue-500"></div>
    </div>
  );
};

export default Loader;
