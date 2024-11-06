import React from 'react';
import { Card } from 'primereact/card';
import Navbar from './Navbar';
import Welcome from '../pages/Welcome';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-column h-screen">
      <Navbar />
      <div className="flex flex-grow-1 justify-content-center p-4 mt-8 overflow-hidden">
        <Welcome />
      </div>
    </div>
  );
};

export default MainLayout;