import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#1B4F8A] px-6 py-4 border-b border-[#1B4F8A]/20">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-3 justify-center">
          {/* <div className="w-8 h-8 bg-[#1B4F8A] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">rs</span>
          </div> */}
          <div>
            <h1 className="text-xl font-bold text-white">Tax Calculator Nepal</h1>
            <p className="text-sm text-slate-400">Income Tax Assessment Tool</p>
          </div>
        </div>
        {/* <div className="flex items-center gap-2 bg-[#1B4F8A]/20 px-4 py-2 rounded-md border border-[#1B4F8A]/30">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">FY 2083/84</span>
        </div> */}
      </div>
    </header>
  );
};

export default Header;