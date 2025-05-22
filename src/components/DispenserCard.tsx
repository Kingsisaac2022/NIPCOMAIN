import React, { useState } from 'react';
import { Gauge, History } from 'lucide-react';
import { Dispenser, DispenserVolumeLog } from '../types';
import Card from './Card';
import Button from './Button';
import InputField from './InputField';

interface DispenserCardProps {
  dispenser: Dispenser;
  onUpdateReadings: (dispenserId: number, nozzleId: number, newReading: number) => void;
}

const DispenserCard: React.FC<DispenserCardProps> = ({ dispenser, onUpdateReadings }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [newReadings, setNewReadings] = useState<Record<number, string>>({});

  const handleReadingChange = (nozzleId: number, value: string) => {
    setNewReadings(prev => ({
      ...prev,
      [nozzleId]: value
    }));
  };

  const handleUpdate = (nozzleId: number) => {
    const reading = parseFloat(newReadings[nozzleId]);
    if (!isNaN(reading) && reading >= 0) {
      onUpdateReadings(dispenser.id, nozzleId, reading);
      setNewReadings(prev => ({
        ...prev,
        [nozzleId]: ''
      }));
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{dispenser.name}</h3>
          <p className="text-text-secondary">{dispenser.productType}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          icon={<History size={16} />}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </Button>
      </div>

      <div className="space-y-4">
        {dispenser.nozzles.map(nozzle => (
          <div key={nozzle.id} className="p-4 bg-background rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{nozzle.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-text-secondary text-sm">Opening</span>
                <p className="font-medium">{nozzle.openingReading}</p>
              </div>
              <div>
                <span className="text-text-secondary text-sm">Closing</span>
                <p className="font-medium">{nozzle.closingReading}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputField
                  label=""
                  type="number"
                  value={newReadings[nozzle.id] || ''}
                  onChange={(e) => handleReadingChange(nozzle.id, e.target.value)}
                  placeholder="Enter new reading"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdate(nozzle.id)}
                className="mt-8"
              >
                Update
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showHistory && dispenser.volumeLog.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="font-medium mb-4">Volume History</h4>
          <div className="space-y-3">
            {dispenser.volumeLog
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
              .map(log => (
                <div key={log.id} className="text-sm p-3 bg-background rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-text-secondary">
                      {dispenser.nozzles.find(n => n.id === log.nozzleId)?.name}
                    </span>
                    <span className="text-text-secondary">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{log.previousReading}</span>
                    <span className="text-text-secondary">→</span>
                    <span className="text-primary">{log.newReading}</span>
                    <span className="text-text-secondary ml-auto">
                      Volume: {log.volumeSold.toLocaleString()} L
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DispenserCard;