import React, { useState } from 'react';
import { History, Filter } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import SelectField from './SelectField';

interface LogEntry {
  id: number;
  type: 'tank' | 'staff' | 'dispenser' | 'sales' | 'price';
  message: string;
  timestamp: string;
  stationId: number;
  stationName: string;
}

interface SystemLogCardProps {
  logs: LogEntry[];
  stations?: { id: number; name: string }[];
}

const SystemLogCard: React.FC<SystemLogCardProps> = ({ logs = [], stations = [] }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tank' | 'staff' | 'dispenser' | 'sales' | 'price'>('all');
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  if (!Array.isArray(logs)) {
    console.error('SystemLogCard: logs prop must be an array');
    return (
      <div className="p-4 text-text-secondary">
        Error loading system logs
      </div>
    );
  }

  const filteredLogs = logs.filter(log => {
    try {
      const matchesTab = activeTab === 'all' || log.type === activeTab;
      const matchesStation = !selectedStation || log.stationId.toString() === selectedStation;
      const matchesDate = !selectedDate || new Date(log.timestamp).toISOString().split('T')[0] === selectedDate;
      return matchesTab && matchesStation && matchesDate;
    } catch (error) {
      console.error('Error filtering logs:', error);
      return false;
    }
  });

  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <History size={20} className="text-primary" />
          System Logs
        </h3>
        <Button
          variant="outline"
          size="sm"
          icon={<Filter size={16} />}
        >
          Filter
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field text-sm"
          />
        </div>
        {stations && stations.length > 0 && (
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
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'tank', 'staff', 'dispenser', 'sales', 'price'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              ${activeTab === tab 
                ? 'bg-primary text-background' 
                : 'bg-background text-text-secondary hover:bg-primary/10'}
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {sortedLogs.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          No logs found
        </div>
      ) : (
        <div className="space-y-4">
          {sortedLogs.map(log => (
            <div key={log.id} className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{log.stationName}</span>
                <span className="text-sm text-text-secondary">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-text-secondary">{log.message}</p>
              <span className={`
                inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium
                ${log.type === 'tank' ? 'bg-primary/10 text-primary' :
                  log.type === 'staff' ? 'bg-success/10 text-success' :
                  log.type === 'dispenser' ? 'bg-warning/10 text-warning' :
                  log.type === 'sales' ? 'bg-info/10 text-info' :
                  'bg-error/10 text-error'}
              `}>
                {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default SystemLogCard;