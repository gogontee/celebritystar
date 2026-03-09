// components/UI/CTAButton.js
'use client';

const CTAButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  onClick,
  className = ''
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 active:scale-95 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:-translate-y-0.5',
    'primary-white': 'bg-white text-orange-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    'outline-white': 'border-2 border-white text-white hover:bg-white/10 hover:-translate-y-0.5'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default CTAButton;