import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 border-opacity-75"></div>
    </div>
  );
};

export default Spinner;