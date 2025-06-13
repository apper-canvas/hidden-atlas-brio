import React from 'react';

const Spinner = ({ className = 'w-5 h-5' }) => {
  return (
    <div className={`${className} border-2 border-white/30 border-t-white rounded-full animate-spin`}></div>
  );
};

export default Spinner;