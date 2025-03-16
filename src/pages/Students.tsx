import React from 'react';
import Students from '../components/Students';
import MainLayout from '../layouts/MainLayout';

const StudentsPage: React.FC = () => {
  return (
    <MainLayout>
      <Students />
    </MainLayout>
  );
};

export default StudentsPage; 