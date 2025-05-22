import React, { useState } from 'react';
import { Tank } from '../types';
import { Droplet, DollarSign, Clock, Lock, RefreshCw } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import InputField from './InputField';
import PriceHistoryGraph from './PriceHistoryGraph';

interface TankCardProps {
  tank: Tank;
  isCEO?: boolean;
  onUpdatePrice?: (tankId: number, newPrice: number, secretKey: string) => void;
  onUpdateVolume?: (tankId: number, newVolume: number) => void;
  onDelete?: (tankId: number) => void;
}

const TankCard: React.FC<TankCardProps> = ({
  tank,
  isCEO = false,
  onUpdatePrice,
  onUpdateVolume,
  onDelete,
}) => {
  const [showPriceUpdate, setShowPriceUpdate] = useState(false);
  const [showVolumeUpdate, setShowVolumeUpdate] = useState(false);
  const [newPrice, setNewPrice] = useState(tank.sellingPrice?.toString() ?? '0');
  const [newVolume, setNewVolume] = useState(tank.currentVolume?.toString() ?? '0');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  const fillPercentage = (tank.currentVolume / tank.capacity) * 100;
  const daysRemaining = tank.estimatedSalesEndTime
    ? Math.ceil((new Date(tank.estimatedSalesEndTime)?.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handlePriceUpdate = () => {
    if (!onUpdatePrice) return;

    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    onUpdatePrice(tank.id, price, secretKey);
    setShowPriceUpdate(false);
    setSecretKey('');
    setError('');
  };

  const handleVolumeUpdate = () => {
    if (!onUpdateVolume) return;

    const volume = parseFloat(newVolume);
    if (isNaN(volume) || volume < 0) {
      setError('Please enter a valid volume');
      return;
    }

    if (volume > tank.capacity) {
      setError('Volume cannot exceed tank capacity');
      return;
    }

    onUpdateVolume(tank.id, volume);
    setShowVolumeUpdate(false);
    setError('');
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${fillPercentage}%` }}
        />
      </div>

      <div className="flex justify-between items-start mb-4 pt-2">
        <div>
          <h3 className="text-xl font-bold">{tank.name}</h3>
          <p className="text-text-secondary">{tank.productType}</p>
        </div>
        <span className={`
          px-2 py-1 rounded-full text-sm font-medium
          ${tank.status === 'Active' 
            ? 'bg-success/10 text-success' 
            : tank.status === 'Maintenance'
            ? 'bg-warning/10 text-warning'
            : 'bg-error/10 text-error'}
        `}>
          {tank.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-background rounded-lg">
          <div className="flex items-center mb-2">
            <Droplet size={16} className="text-primary mr-2" />
            <span className="text-text-secondary text-sm">Volume</span>
          </div>
          <p className="text-lg font-bold">
            {tank.currentVolume.toLocaleString()} / {tank.capacity.toLocaleString()} L
          </p>
        </div>

        <div className="p-4 bg-background rounded-lg">
          <div className="flex items-center mb-2">
            <DollarSign size={16} className="text-primary mr-2" />
            <span className="text-text-secondary text-sm">Price</span>
          </div>
          <p className="text-lg font-bold">₦{(tank.sellingPrice ?? 0).toLocaleString()}/L</p>
        </div>
      </div>

      <div className="p-4 bg-background rounded-lg mb-6">
        <div className="flex items-center mb-2">
          <DollarSign size={16} className="text-primary mr-2" />
          <span className="text-text-secondary text-sm">Expected Revenue</span>
        </div>
        <p className="text-2xl font-bold text-primary">
          ₦{(tank.expectedRevenue ?? 0).toLocaleString()}
        </p>
      </div>

      {daysRemaining !== null && (
        <div className="flex items-center mb-6">
          <Clock size={16} className="text-warning mr-2" />
          <span className="text-text-secondary">
            {daysRemaining} days remaining
          </span>
        </div>
      )}

      {tank.priceHistory?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Price History</h4>
          <PriceHistoryGraph priceHistory={tank.priceHistory} />
        </div>
      )}

      <div className="space-y-4">
        {isCEO ? (
          showPriceUpdate ? (
            <div className="space-y-4">
              <InputField
                label="New Price (₦)"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                error={error}
              />
              
              <InputField
                label="Secret Key"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                icon={<Lock size={20} />}
              />

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handlePriceUpdate}
                  fullWidth
                >
                  Set Price
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPriceUpdate(false);
                    setError('');
                  }}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => setShowPriceUpdate(true)}
                icon={<DollarSign size={20} />}
                fullWidth
              >
                Set Price
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete?.(tank.id)}
                fullWidth
              >
                Delete Tank
              </Button>
            </div>
          )
        ) : (
          showVolumeUpdate ? (
            <div className="space-y-4">
              <InputField
                label="New Volume (Liters)"
                type="number"
                value={newVolume}
                onChange={(e) => setNewVolume(e.target.value)}
                error={error}
              />

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleVolumeUpdate}
                  fullWidth
                >
                  Update Volume
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowVolumeUpdate(false);
                    setError('');
                  }}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={() => setShowVolumeUpdate(true)}
              icon={<RefreshCw size={20} />}
              fullWidth
            >
              Update Volume
            </Button>
          )
        )}
      </div>
    </Card>
  );
};

export default TankCard;