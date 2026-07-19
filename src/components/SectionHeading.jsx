import React from 'react';

const SectionHeading = ({ children }) => {
  return (
    <div className="flex items-center gap-3 mt-6 mb-3">
      <div className="w-1 h-4 bg-[#1B4F8A] rounded-full" />
      <span className="text-[14px] md:text-[17px] font-bold uppercase tracking-widest text-[#1B4F8A]">
        {children}
      </span>
    </div>
  );
};

export default SectionHeading;