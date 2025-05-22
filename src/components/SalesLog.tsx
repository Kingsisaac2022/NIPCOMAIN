import React, { useState } from 'react';
import { Download, FileText, DollarSign, Calendar } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import SelectField from './SelectField';

interface SalesEntry {
  id: number;
  stationId: number;
  staffId: number;
  staffName: string;
  dispenserId: number;
  dispenserName: string;
  nozzleId: number;
  nozzleName: string;
  shift: 'Morning' | 'Afternoon';
  openingReading: number;
  closingReading: number;
  volumeSold: number;
  revenue: number;
  date: string;
  time: string;
}

interface SalesLogProps {
  sales: SalesEntry[];
  stationName: string;
  onDownload?: () => void;
  onSendToCEO?: () => void;
  showStationFilter?: boolean;
  stations?: { id: number; name: string; }[];
}

const SalesLog: React.FC<SalesLogProps> = ({
  sales,
  stationName,
  onDownload,
  onSendToCEO,
  showStationFilter = false,
  stations = []
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedShift, setSelectedShift] = useState<'all' | 'Morning' | 'Afternoon'>('all');

  const filteredSales = sales.filter(sale => {
    const matchesDate = selectedDate ? sale.date === selectedDate : true;
    const matchesStation = selectedStation ? sale.stationId.toString() === selectedStation : true;
    const matchesShift = selectedShift !== 'all' ? sale.shift === selectedShift : true;
    return matchesDate && matchesStation && matchesShift;
  });

  // Calculate summary
  const summary = {
    totalVolume: filteredSales.reduce((sum, sale) => sum + sale.volumeSold, 0),
    totalRevenue: filteredSales.reduce((sum, sale) => sum + sale.revenue, 0),
    staffSummary: filteredSales.reduce((acc, sale) => {
      const key = `${sale.staffId}-${sale.staffName}`;
      if (!acc[key]) {
        acc[key] = {
          name: sale.staffName,
          volume: 0,
          revenue: 0,
          transactions: 0
        };
      }
      acc[key].volume += sale.volumeSold;
      acc[key].revenue += sale.revenue;
      acc[key].transactions += 1;
      return acc;
    }, {} as Record<string, { name: string; volume: number; revenue: number; transactions: number; }>)
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold">Sales Log</h3>
        </div>
        <div className="flex gap-2">
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              icon={<Download size={16} />}
            >
              Download Report
            </Button>
          )}
          {onSendToCEO && (
            <Button
              variant="primary"
              size="sm"
              onClick={onSendToCEO}
            >
              Send to CEO
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          {showStationFilter && stations.length > 0 && (
            <div className="flex-1">
              <SelectField
                label=""
                options={[
                  { value: '', label: 'All Stations' },
                  ...stations.map(s => ({ value: s.id.toString(), label: s.name }))
                ]}
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
              />
            </div>
          )}
          <div className="flex-1">
            <SelectField
              label=""
              options={[
                { value: 'all', label: 'All Shifts' },
                { value: 'Morning', label: 'Morning Shift' },
                { value: 'Afternoon', label: 'Afternoon Shift' }
              ]}
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value as any)}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-primary" />
              <span className="text-text-secondary">Total Volume</span>
            </div>
            <p className="text-2xl font-bold">{summary.totalVolume.toLocaleString()} L</p>
          </div>
          
          <div className="p-4 bg-background rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-primary" />
              <span className="text-text-secondary">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold">₦{summary.totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="p-4 bg-background rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-primary" />
              <span className="text-text-secondary">Transactions</span>
            </div>
            <p className="text-2xl font-bold">{filteredSales.length}</p>
          </div>
        </div>

        {/* Staff Summary */}
        <div className="space-y-4">
          <h4 className="font-bold">Staff Performance</h4>
          <div className="space-y-2">
            {Object.entries(summary.staffSummary).map(([key, staff]) => (
              <div key={key} className="p-4 bg-background rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{staff.name}</h5>
                    <p className="text-sm text-text-secondary">
                      {staff.transactions} transactions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{staff.volume.toLocaleString()} L</p>
                    <p className="text-sm text-primary">₦{staff.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales List */}
        <div className="space-y-4">
          <h4 className="font-bold">Sales Records</h4>
          {filteredSales.length > 0 ? (
            <div className="space-y-4">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="p-4 bg-background rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium">{sale.staffName}</h5>
                      <p className="text-sm text-text-secondary">
                        {sale.dispenserName} - {sale.nozzleName}
                      </p>
                    </div>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${sale.shift === 'Morning' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}
                    `}>
                      {sale.shift} Shift
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Volume</span>
                      <p className="font-medium">{sale.volumeSold.toLocaleString()} L</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Revenue</span>
                      <p className="font-medium">₦{sale.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-text-secondary">
                    {sale.date} at {sale.time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              No sales records found
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SalesLog;