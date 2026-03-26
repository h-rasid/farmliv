import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StaffPerformanceChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Poppins', size: 10, weight: '500' } }
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  const chartData = {
    labels: data.map(item => item.executive_name),
    datasets: [
      {
        label: 'Total Leads',
        data: data.map(item => item.total_leads),
        backgroundColor: 'rgba(203, 213, 225, 0.5)', // Slate
        borderRadius: 8,
      },
      {
        label: 'Converted',
        data: data.map(item => item.successful_conversions),
        backgroundColor: '#10b981', // Farmliv Green
        borderRadius: 8,
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
};

export default StaffPerformanceChart;

