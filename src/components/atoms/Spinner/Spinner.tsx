import React from "react";
import type { SpinnerProps } from "./Spinner.types";

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const sizes: Record<NonNullable<SpinnerProps['size']>, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};