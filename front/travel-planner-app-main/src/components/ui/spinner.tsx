// src/components/ui/spinner.tsx
import { FC } from 'react';

const Spinner: FC = () => (
  <div className="flex justify-center items-center">
    <div className="w-8 h-8 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
  </div>
);

export { Spinner };
