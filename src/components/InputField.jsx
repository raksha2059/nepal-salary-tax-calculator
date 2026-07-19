import React, { useRef, useEffect } from 'react';

const InputField = ({
  label,
  hint,
  value,
  onChange,
  disabled,
  placeholder,
  type = "number",
  className = "",
  readOnly = false,
  ...props

}) => {

  const inputRef = useRef(null);

  useEffect(() => {
    if (type !== "number") return;
    const input = inputRef.current;
    if (!input) return;

    const handleWheel = (e) => {
      if (document.activeElement !== input) return;
      e.preventDefault();
      if (e.deltaY < 0) {
        input.stepUp();
      } else {
        input.stepDown();
      }
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    input.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      input.removeEventListener("wheel", handleWheel);
    };
  }, [type]);


  return (
    <div className={className}>
      <label className="text-[14px] md:text-[17px] font-medium text-slate-500 mb-0 md:mb-1.5 block">
        {label}
      </label>

      {hint && (
        <p className="text-[13px] md:text-[17px] text-slate-400 mb-1">
          {hint}
        </p>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        ref={inputRef}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full border rounded-md px-3 py-2 md:px-3.5 md:py-2.5
        text-[14px] md:text-[17px] font-semibold text-slate-800 bg-white
        focus:outline-none focus:border-[#1B4F8A] focus:ring-2 focus:ring-[#1B4F8A]/10 transition-all
        ${disabled ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed' : ''}
        ${readOnly ? 'bg-slate-50 text-slate-500 border-slate-200' : 'border-slate-300'}
        placeholder:text-[14px] md:placeholder:text-[17px]
        placeholder:text-slate-300 placeholder:font-normal`}
        {...props}
      />
    </div>
  );
};



export default InputField;