import React from 'react';

interface PayPalLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PayPalLogo: React.FC<PayPalLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Signature PayPal Double-P monogram */}
      <svg
        className={iconSizes[size]}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M29.5 12.2C28.7 8.9 26 6.8 21.8 6.8H11.5C10.5 6.8 9.7 7.5 9.5 8.5L4.5 30.5C4.4 31.2 4.9 31.8 5.6 31.8H12.2L13.8 21.4C14 20.4 14.8 19.7 15.8 19.7H19C24.8 19.7 29.4 17.3 30.7 10.3C30.4 11 30 11.6 29.5 12.2Z"
          fill="#003087"
        />
        <path
          d="M32.2 14.5C31.4 11.2 28.7 9.1 24.5 9.1H14.2C13.2 9.1 12.4 9.8 12.2 10.8L7.2 32.8C7.1 33.5 7.6 34.1 8.3 34.1H14.9L16.5 23.7C16.7 22.7 17.5 22 18.5 22H21.7C27.5 22 32.1 19.6 33.4 12.6C33.1 13.3 32.7 13.9 32.2 14.5Z"
          fill="#0079C1"
          opacity="0.9"
        />
        <path
          d="M16.5 23.7L18.5 22H21.7C27.5 22 32.1 19.6 33.4 12.6C32.7 15.6 30.5 17.6 26.8 18.5L25.3 19.1C24.4 19.4 23.4 19.6 22.4 19.6H17.4L16.5 23.7Z"
          fill="#00457C"
          opacity="0.85"
        />
      </svg>

      {showText && (
        <span
          className={`font-extrabold tracking-tight italic ${textSizes[size]}`}
        >
          <span className="text-[#003087] dark:text-[#0079C1]">Pay</span>
          <span className="text-[#0079C1] dark:text-[#38BDF8]">Pal</span>
        </span>
      )}
    </div>
  );
};
