import React, { useState } from 'react';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';
import { DispenserVolumeLog } from '../types';
import Card from './Card';
import Button from './Button';
import SelectField from './SelectField';

interface DispenserVolumeLogCardProps {
  logs: DispenserVolumeLog[];
  stationName: string;
  dispenserName: string;
  stations?: { id: number; name: string }[];
}

const DispenserVolumeLogCard: React.FC<DispenserVolumeLogCardProps> = ({ 
  logs, 
  stationName, 
  dispenserName,
  stations 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const itemsPerPage = 5;

  // Filter logs based on selected date and station
  const filteredLogs = logs.filter(log => {
    const matchesDate = selectedDate 
      ? new Date(log.timestamp).toISOString().split('T')[0] === selectedDate 
      : true;
    const matchesStation = selectedStation
      ? log.stationId.toString() === selectedStation
      : true;
    return matchesDate && matchesStation;
  });

  // Sort logs by timestamp (newest first)
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <History size={20} className="text-primary mr-2" />
          Volume Updates
        </h3>
        <span className="text-text-secondary text-sm">{stationName}</span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field text-sm"
            />
          </div>
          {stations && (
            <div className="flex-1">
              <SelectField
                label=""
                options={[
                  { value: '', label: 'All Stations' },
                  ...stations.map(s => ({ value: s.id.toString(), label: s.name }))
                ]}
                value={selectedStation}
                onChange={(e) => {
                  setSelectedStation(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {paginatedLogs.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-background rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{dispenserName}</span>
                  <span className="text-sm text-text-secondary">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-secondary">
                    {log.previousReading.toLocaleString()}
                  </span>
                  <span className="text-text-secondary">→</span>
                  <span className="text-primary font-medium">
                    {log.newReading.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-sm text-text-secondary">
                  Volume Sold: {log.volumeSold.toLocaleString()} L
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                icon={<ChevronLeft size={16} />}
              >
                Previous
              </Button>
              <span className="text-text-secondary">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                icon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-text-secondary text-center py-4">
          No volume updates recorded yet
        </p>
      )}
    </Card>
  );
}

export default DispenserVolumeLogCard;