import React from 'react';
import { Bar } from 'react-chartjs-2';


const Performance = () => {
  const data = {
    labels: ['Class 1', 'Class 2', 'Class 3'],  // Add class names
    datasets: [
      {
        label: 'Maths',
        data: [85, 90, 78],  // Replace with actual data
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Science',
        data: [88, 92, 80],  // Replace with actual data
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Performance</h2>
      <Bar data={data} />
    </div>
  );
};

export default Performance;
