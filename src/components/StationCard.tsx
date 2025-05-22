import React from 'react';
import { MapPin, User, Phone } from 'lucide-react';
import { Station } from '../types';

interface StationCardProps {
  station: Station;
  onClick?: () => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, onClick }) => {
  const handleClick = () => {
    if (station.active && onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className={`
        relative flex overflow-hidden rounded-xl
        transition-all duration-300 h-[400px]
        ${station.active ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-60 cursor-not-allowed'} 
        ${station.active && 'hover:shadow-2xl'}
        bg-card-bg
        group
      `}
      onClick={handleClick}
    >
      {/* Left Content Area */}
      <div className="flex-1 p-8 flex flex-col justify-between">
        {/* Station Name and Status */}
        <div>
          <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors">
            {station.name.replace('NIPCO Station ', '')}
          </h3>
          <div className="text-lg text-text-secondary mt-2">
            {station.managerName || 'No manager assigned'}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-auto">
          <span className={`
            inline-block text-sm font-medium px-4 py-2 rounded-full
            ${station.active 
              ? 'bg-success/10 text-success' 
              : 'bg-inactive/10 text-inactive'}
          `}>
            {station.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Contact Details */}
        {station.active && (
          <div className="space-y-4">
            {station.address && (
              <div className="flex items-center">
                <div className="bg-background rounded-lg p-2.5 mr-3">
                  <MapPin size={18} className="text-primary" />
                </div>
                <span className="text-text-secondary line-clamp-1">
                  {station.address}
                </span>
              </div>
            )}
            
            {station.managerPhone && (
              <button
                className="bg-background text-primary hover:bg-primary/10 transition-colors rounded-lg px-4 py-2 font-medium"
              >
                {station.managerPhone}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right Image Area */}
      <div className="w-[40%] relative overflow-hidden rounded-r-xl">
        {station.managerPhoto ? (
          <img 
            src={station.managerPhoto} 
            alt={station.managerName || 'Station manager'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 flex items-center justify-center">
            <div className="rounded-full bg-background p-8 backdrop-blur-sm">
              <User size={48} className="text-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationCard;