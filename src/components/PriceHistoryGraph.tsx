import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PriceHistory } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PriceHistoryGraphProps {
  priceHistory: PriceHistory[];
}

const PriceHistoryGraph: React.FC<PriceHistoryGraphProps> = ({ priceHistory = [] }) => {
  if (!Array.isArray(priceHistory) || priceHistory.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-text-secondary">
        No price history data available
      </div>
    );
  }

  const sortedHistory = [...priceHistory].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const data = {
    labels: sortedHistory.map(h => new Date(h.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Price per Liter (₦)',
        data: sortedHistory.map(h => h.price),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#FFD700',
        pointBorderColor: '#1e1e1e',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: '#f5f5f5',
        bodyColor: '#f5f5f5',
        borderColor: '#FFD700',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `₦${context.parsed.y.toLocaleString()} per liter`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#aaaaaa',
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#aaaaaa',
          callback: (value: number) => `₦${value.toLocaleString()}`,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-48">
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceHistoryGraph;

export { PriceHistoryGraph }