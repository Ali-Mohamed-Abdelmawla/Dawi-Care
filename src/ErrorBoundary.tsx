import React, { ReactNode } from 'react';
import useErrorBoundary from './useErrorBoundary';

interface Props {
  children: ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const hasError = useErrorBoundary();

  if (hasError) {
    return <h1>حدث خطأ ما</h1>;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
