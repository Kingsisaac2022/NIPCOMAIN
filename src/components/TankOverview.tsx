import React from 'react';
import { Tank } from '../types';
import { Droplet, AlertTriangle } from 'lucide-react';
import { Card } from './Card';

interface TankOverviewProps {
  tanks: Tank[];
  stationName: string;
}

const TankOverview: React.FC<TankOverviewProps> = ({ tanks, stationName }) => {
  const getLevelColor = (percentage: number) => {
    if (percentage < 20) return 'bg-error';
    if (percentage < 40) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{stationName}</h3>
        <span className="text-text-secondary">{tanks.length} Tanks</span>
      </div>

      <div className="space-y-4">
        {tanks.map(tank => {
          const percentage = (tank.currentVolume / tank.capacity) * 100;
          const levelColor = getLevelColor(percentage);

          return (
            <div key={tank.id} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplet 
                    size={16} 
                    className={tank.productType === 'PMS' ? 'text-primary' : 'text-warning'} 
                  />
                  <span className="font-medium">{tank.name}</span>
                </div>
                <span className="text-sm text-text-secondary">
                  {tank.productType}
                </span>
              </div>

              {/* Tank visualization */}
              <div className="relative h-16 bg-background rounded-lg overflow-hidden">
                {/* Tank level */}
                <div 
                  className={`absolute bottom-0 left-0 w-full transition-all duration-500 ${levelColor}`}
                  style={{ height: `${percentage}%` }}
                />
                
                {/* Tank info overlay */}
                <div className="absolute inset-0 flex items-center justify-between p-3 text-sm">
                  <span className="font-medium">
                    {tank.currentVolume.toLocaleString()} L
                  </span>
                  <span className="text-text-secondary">
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                {/* Low level warning */}
                {percentage < 20 && (
                  <div className="absolute top-2 right-2">
                    <AlertTriangle size={16} className="text-error" />
                  </div>
                )}
              </div>

              {/* Tank details */}
              <div className="flex justify-between mt-2 text-sm text-text-secondary">
                <span>Capacity: {tank.capacity.toLocaleString()} L</span>
                <span>₦{tank.sellingPrice}/L</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TankOverview;