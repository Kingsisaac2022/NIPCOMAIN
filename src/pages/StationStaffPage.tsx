import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Search, Sun, Moon } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';

const StationStaffPage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const { getStation } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftStatus, setShiftStatus] = useState<Record<number, 'morning' | 'afternoon'>>({});

  const station = getStation(parseInt(stationId || '0'));
  
  if (!station) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Station not found</p>
      </div>
    );
  }

  const filteredStaff = station.staff?.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleShiftChange = (staffId: number, shift: 'morning' | 'afternoon') => {
    setShiftStatus(prev => ({
      ...prev,
      [staffId]: shift
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title={`${station.name} - Staff Directory`} showBack stationId={station.id} />
      
      <main className="page-container fade-in">
        <div className="mb-8">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map(staff => (
            <Card key={staff.id} className="flex flex-col">
              <div className="aspect-square relative overflow-hidden bg-background rounded-lg mb-4">
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

              <h3 className="text-lg font-bold mb-1">{staff.name}</h3>
              <p className="text-primary text-sm font-medium mb-2">{staff.role}</p>
              <p className="text-text-secondary text-sm mb-4">{staff.phone}</p>

              <div className="mt-auto grid grid-cols-2 gap-2">
                <Button
                  variant={shiftStatus[staff.id] === 'morning' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleShiftChange(staff.id, 'morning')}
                  icon={<Sun size={16} />}
                  fullWidth
                >
                  Morning
                </Button>
                <Button
                  variant={shiftStatus[staff.id] === 'afternoon' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleShiftChange(staff.id, 'afternoon')}
                  icon={<Moon size={16} />}
                  fullWidth
                >
                  Afternoon
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No staff members found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StationStaffPage;