import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopProductsChart = ({ salesData }) => {
  // 1. Data Grouping Logic: Product wise total amount calculate karna
  const productSales = salesData.reduce((acc, sale) => {
    const name = sale.product_name || 'Other';
    acc[name] = (acc[name] || 0) + parseFloat(sale.amount);
    return acc;
  }, {});

  // 2. Sorting: Sabse zyada bikne wale products upar
  const sortedLabels = Object.keys(productSales).sort((a, b) => productSales[b] - productSales[a]).slice(0, 5);
  const sortedValues = sortedLabels.map(label => productSales[label]);

  const data = {
    labels: sortedLabels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: sortedValues,
        backgroundColor: '#2E7D32', // Farmliv Green
        borderRadius: 12,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 15,
        displayColors: false
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false }, ticks: { font: { weight: 'bold' } } },
      x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } }
    }
  };

  return <Bar data={data} options={options} />;
};

export default TopProductsChart;
