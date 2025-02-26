import React from 'react';
import { Environment } from '@react-three/drei';
// Example Base Scene component
const BaseScene: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Environment preset="sunset" />
      {children}
    </>
  );
};

export default BaseScene;
