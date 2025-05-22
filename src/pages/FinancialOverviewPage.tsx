import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  CircleDollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Percent
} from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import BottomNav from '../components/BottomNav';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FinancialOverviewPage: React.FC = () => {
  const { stations } = useAppContext();
  const [dateRange, setDateRange] = useState('week');

  // Financial Calculations
  const calculateTotalSales = () => {
    return stations
      .filter(s => s.id !== 1)
      .reduce((total, station) => 
        total + (station.sales || []).reduce((sum, sale) => sum + sale.revenue, 0)
      , 0);
  };

  const calculateTotalExpenses = () => {
    return stations
      .filter(s => s.id !== 1)
      .reduce((total, station) => 
        total + (station.expenses || []).reduce((sum, expense) => sum + expense.amount, 0)
      , 0);
  };

  const calculateNetProfit = () => {
    const totalSales = calculateTotalSales();
    const totalExpenses = calculateTotalExpenses();
    return totalSales - totalExpenses;
  };

  // Calculate profit margin
  const calculateProfitMargin = () => {
    const totalSales = calculateTotalSales();
    const netProfit = calculateNetProfit();
    return totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  };

  // Calculate revenue per station
  const calculateRevenuePerStation = () => {
    const activeStations = stations.filter(s => s.id !== 1 && s.active).length;
    return activeStations > 0 ? calculateTotalSales() / activeStations : 0;
  };

  // Calculate expected vs actual revenue
  const calculateRevenueAchievement = () => {
    const expectedRevenue = stations
      .filter(s => s.id !== 1)
      .reduce((total, station) => 
        total + station.tanks.reduce((sum, tank) => sum + (tank.expectedRevenue || 0), 0)
      , 0);
    const actualRevenue = calculateTotalSales();
    return expectedRevenue > 0 ? (actualRevenue / expectedRevenue) * 100 : 0;
  };

  // Chart Data
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 59000, 80000, 81000, 56000, 95000, 90000],
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const stationProfitData = {
    labels: stations.filter(s => s.id !== 1).map(s => s.name),
    datasets: [
      {
        label: 'Profit',
        data: stations
          .filter(s => s.id !== 1)
          .map(station => 
            (station.sales || []).reduce((sum, sale) => sum + sale.revenue, 0) -
            (station.expenses || []).reduce((sum, expense) => sum + expense.amount, 0)
          ),
        backgroundColor: '#FFD700',
      },
    ],
  };

  const productDistributionData = {
    labels: ['PMS', 'AGO'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['#FFD700', '#FFA500'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#B0B0B0',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#B0B0B0',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#B0B0B0',
          callback: (value: number) => `₦${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Financial Overview" showBack stationId={1} />
      
      <main className="page-container fade-in py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <CircleDollarSign size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-text-secondary">Total Sales</p>
                <p className="text-2xl font-bold">₦{calculateTotalSales().toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                <TrendingDown size={24} className="text-error" />
              </div>
              <div>
                <p className="text-text-secondary">Total Expenses</p>
                <p className="text-2xl font-bold">₦{calculateTotalExpenses().toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-success" />
              </div>
              <div>
                <p className="text-text-secondary">Net Profit</p>
                <p className="text-2xl font-bold">₦{calculateNetProfit().toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Percent size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-text-secondary">Profit Margin</p>
                <p className="text-2xl font-bold">{calculateProfitMargin().toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Advanced Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <ArrowUpRight size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-text-secondary">Revenue per Station</p>
                <p className="text-2xl font-bold">₦{calculateRevenuePerStation().toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Target size={24} className="text-warning" />
              </div>
              <div>
                <p className="text-text-secondary">Revenue Achievement</p>
                <p className="text-2xl font-bold">{calculateRevenueAchievement().toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <ArrowDownRight size={24} className="text-success" />
              </div>
              <div>
                <p className="text-text-secondary">Expense Ratio</p>
                <p className="text-2xl font-bold">
                  {((calculateTotalExpenses() / calculateTotalSales()) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Trend */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary" />
                  Revenue Trend
                </h3>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="input-field w-auto text-sm"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div className="h-[300px]">
                <Line data={revenueData} options={chartOptions} />
              </div>
            </Card>

            {/* Profit by Station */}
            <Card>
              <h3 className="text-lg font-bold mb-6">Profit by Station</h3>
              <div className="h-[300px]">
                <Bar data={stationProfitData} options={chartOptions} />
              </div>
            </Card>

            {/* Product Distribution */}
            <Card>
              <h3 className="text-lg font-bold mb-6">Product Distribution</h3>
              <div className="h-[300px]">
                <Pie data={productDistributionData} options={chartOptions} />
              </div>
            </Card>
          </div>

          {/* Station Performance */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-bold mb-6">Station Performance</h3>
              <div className="space-y-6">
                {stations.filter(s => s.id !== 1).map(station => {
                  const totalSales = (station.sales || [])
                    .reduce((sum, sale) => sum + sale.revenue, 0);
                  const totalExpenses = (station.expenses || [])
                    .reduce((sum, expense) => sum + expense.amount, 0);
                  const profit = totalSales - totalExpenses;
                  const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;
                  
                  return (
                    <div key={station.id} className="p-4 bg-background rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{station.name}</h4>
                        <span className={`
                          px-2 py-1 rounded-full text-sm
                          ${profit >= 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}
                        `}>
                          {profit >= 0 ? 'Profit' : 'Loss'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Sales</span>
                          <span>₦{totalSales.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Expenses</span>
                          <span>₦{totalExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Margin</span>
                          <span>{profitMargin.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                          <span className="text-text-secondary">Net Profit</span>
                          <span className={profit >= 0 ? 'text-success' : 'text-error'}>
                            ₦{profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default FinancialOverviewPage;