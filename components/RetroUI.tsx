import React, { InputHTMLAttributes, ButtonHTMLAttributes, TextareaHTMLAttributes } from 'react';

// --- Styles Helpers ---
const bevelOut = "border-t-[var(--border-light)] border-l-[var(--border-light)] border-b-[var(--border-dark)] border-r-[var(--border-dark)] border-2";
const bevelIn = "border-t-[var(--border-dark)] border-l-[var(--border-dark)] border-b-[var(--border-light)] border-r-[var(--border-light)] border-2";

// --- Window Container ---
export const RetroWindow: React.FC<{ title: string; children: React.ReactNode; className?: string; onClose?: () => void }> = ({ title, children, className = "", onClose }) => {
  return (
    <div className={`bg-[var(--bg-chrome)] text-[var(--text-chrome)] ${bevelOut} p-1 shadow-lg flex flex-col ${className}`}>
      <div className="bg-[var(--highlight)] text-[var(--highlight-text)] px-2 py-1 font-bold text-sm flex justify-between items-center select-none mb-1">
        <span>{title}</span>
        {onClose && (
          <button 
            onClick={onClose} 
            className={`bg-[var(--bg-chrome)] text-[var(--text-chrome)] w-5 h-5 flex items-center justify-center text-xs font-bold ${bevelOut} active:border-t-[var(--border-dark)] active:border-l-[var(--border-dark)] active:border-b-[var(--border-light)] active:border-r-[var(--border-light)]`}
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
    <div className={`bg-[var(--bg-chrome)] text-[var(--text-chrome)] ${bevelOut} p-4 ${className}`}>
      {children}
    </div>
  );
};

// --- Inset Panel ---
export const RetroInset: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-[var(--bg-inset)] text-[var(--text-main)] ${bevelIn} p-2 ${className}`}>
      {children}
    </div>
  );
};

// --- Button ---
export const RetroButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'default' }> = ({ children, className = "", variant = 'default', ...props }) => {
  return (
    <button 
      className={`
        bg-[var(--bg-chrome)] text-[var(--text-chrome)]
        ${bevelOut} 
        active:border-t-[var(--border-dark)] active:border-l-[var(--border-dark)] active:border-b-[var(--border-light)] active:border-r-[var(--border-light)] 
        px-4 py-1 
        text-sm font-bold active:bg-[var(--border-shadow)] transition-none
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
      className={`bg-[var(--bg-inset)] text-[var(--text-main)] ${bevelIn} px-2 py-1 text-sm outline-none focus:bg-[var(--bg-inset)] ${className}`} 
      {...props} 
    />
  );
};

// --- Textarea ---
export const RetroTextarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = "", ...props }) => {
  return (
    <textarea 
      className={`bg-[var(--bg-inset)] text-[var(--text-main)] ${bevelIn} px-2 py-1 text-sm outline-none focus:bg-[var(--bg-inset)] resize-none ${className}`} 
      {...props} 
    />
  );
};

// --- Select ---
export const RetroSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = "", children, ...props }) => {
  return (
    <div className="relative inline-block w-full">
      <select 
        className={`w-full bg-[var(--bg-inset)] text-[var(--text-main)] ${bevelIn} px-2 py-1 text-sm outline-none appearance-none rounded-none focus:bg-[var(--bg-inset)] ${className}`} 
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-1 top-1 bottom-1 w-6 bg-[var(--bg-chrome)] border-t-[var(--border-light)] border-l-[var(--border-light)] border-b-[var(--border-dark)] border-r-[var(--border-dark)] border-2 pointer-events-none flex items-center justify-center">
        <span className="text-[10px] text-[var(--text-chrome)]">▼</span>
      </div>
    </div>
  );
};

// --- Progress Bar ---
export const RetroProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`relative h-6 w-full bg-[var(--bg-inset)] ${bevelIn}`}>
      <div 
        className="h-full bg-[var(--highlight)] flex items-center justify-end overflow-hidden" 
        style={{ width: `${percentage}%` }}
      >
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold mix-blend-difference text-[var(--text-chrome)] pointer-events-none" style={{ filter: 'invert(1)' }}>
        {Math.round(percentage)}%
      </div>
    </div>
  );
};
