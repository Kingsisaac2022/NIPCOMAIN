import React from 'react';
import { Phone, Mail, Calendar, Building } from 'lucide-react';
import { Staff } from '../types';

interface StaffCardProps {
  staff: Staff;
  stationName: string;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, stationName }) => {
  return (
    <div className="bg-card-bg rounded-xl border-2 border-gray-700 overflow-hidden transition-all hover:border-primary">
      <div className="aspect-square relative overflow-hidden bg-background">
        {staff.photo ? (
          <img 
            src={staff.photo} 
            alt={staff.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <span className="text-4xl font-bold text-primary">
              {staff.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">{staff.name}</h3>
        <p className="text-primary text-sm font-medium mb-4">{staff.role}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Building size={16} className="text-text-secondary mr-2" />
            <span className="text-text-secondary">{stationName}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone size={16} className="text-text-secondary mr-2" />
            <span className="text-text-secondary">{staff.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail size={16} className="text-text-secondary mr-2" />
            <span className="text-text-secondary">{staff.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar size={16} className="text-text-secondary mr-2" />
            <span className="text-text-secondary">
              Joined {new Date(staff.dateEmployed).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;