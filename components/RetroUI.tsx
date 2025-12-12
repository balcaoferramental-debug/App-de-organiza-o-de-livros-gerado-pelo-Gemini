import React, { InputHTMLAttributes, ButtonHTMLAttributes, TextareaHTMLAttributes } from 'react';

// --- Styles Helpers ---
const bevelOut = "border-t-white border-l-white border-b-black border-r-black border-2";
const bevelIn = "border-t-black border-l-black border-b-white border-r-white border-2";

// --- Window Container ---
export const RetroWindow: React.FC<{ title: string; children: React.ReactNode; className?: string; onClose?: () => void }> = ({ title, children, className = "", onClose }) => {
  return (
    <div className={`bg-[#c0c0c0] ${bevelOut} p-1 shadow-lg flex flex-col ${className}`}>
      <div className="bg-[#000080] text-white px-2 py-1 font-bold text-sm flex justify-between items-center select-none mb-1 bg-gradient-to-r from-[#000080] to-[#1084d0]">
        <span>{title}</span>
        {onClose && (
          <button 
            onClick={onClose} 
            className={`bg-[#c0c0c0] text-black w-5 h-5 flex items-center justify-center text-xs font-bold ${bevelOut} active:border-t-black active:border-l-black active:border-b-white active:border-r-white`}
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex-1 p-2 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// --- Panel/Card ---
export const RetroPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-[#c0c0c0] ${bevelOut} p-4 ${className}`}>
      {children}
    </div>
  );
};

// --- Inset Panel ---
export const RetroInset: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white ${bevelIn} p-2 ${className}`}>
      {children}
    </div>
  );
};

// --- Button ---
export const RetroButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'default' }> = ({ children, className = "", variant = 'default', ...props }) => {
  return (
    <button 
      className={`
        bg-[#c0c0c0] 
        ${bevelOut} 
        active:border-t-black active:border-l-black active:border-b-white active:border-r-white 
        px-4 py-1 
        text-sm font-bold active:bg-[#b0b0b0] transition-none
        ${variant === 'primary' ? 'border-2' : ''}
        ${className}
      `} 
      {...props}
    >
      <span className={variant === 'primary' ? 'border border-black border-dotted px-1' : ''}>
        {children}
      </span>
    </button>
  );
};

// --- Input ---
export const RetroInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => {
  return (
    <input 
      className={`bg-white ${bevelIn} px-2 py-1 text-sm outline-none focus:bg-yellow-50 ${className}`} 
      {...props} 
    />
  );
};

// --- Textarea ---
export const RetroTextarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = "", ...props }) => {
  return (
    <textarea 
      className={`bg-white ${bevelIn} px-2 py-1 text-sm outline-none focus:bg-yellow-50 resize-none ${className}`} 
      {...props} 
    />
  );
};

// --- Select ---
export const RetroSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = "", children, ...props }) => {
  return (
    <div className="relative inline-block w-full">
      <select 
        className={`w-full bg-white ${bevelIn} px-2 py-1 text-sm outline-none appearance-none rounded-none focus:bg-yellow-50 ${className}`} 
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-1 top-1 bottom-1 w-6 bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-2 pointer-events-none flex items-center justify-center">
        <span className="text-[10px]">▼</span>
      </div>
    </div>
  );
};

// --- Progress Bar ---
export const RetroProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`relative h-6 w-full bg-white ${bevelIn}`}>
      <div 
        className="h-full bg-[#000080] flex items-center justify-end overflow-hidden" 
        style={{ width: `${percentage}%` }}
      >
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold mix-blend-difference text-white pointer-events-none">
        {Math.round(percentage)}%
      </div>
    </div>
  );
};
