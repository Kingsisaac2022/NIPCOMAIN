import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Database } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';
import TankCard from '../components/TankCard';
import TankForm from '../components/TankForm';
import Modal from '../components/Modal';
import TankLogCard from '../components/TankLogCard';
import { Tank, VolumeLog } from '../types';

const TankManagementPage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const { getStation, createTank, updateTank, deleteTank } = useAppContext();
  
  const id = parseInt(stationId || '0');
  const station = getStation(id);
  const isCEO = id === 1;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const handleCreateTank = (tankData: Omit<Tank, 'id' | 'stationId' | 'priceHistory' | 'volumeLog'>) => {
    createTank(id, {
      ...tankData,
      volumeLog: [],
    });
    setIsCreateModalOpen(false);
  };
  
  const handleUpdatePrice = (tankId: number, newPrice: number, secretKey: string) => {
    const tank = station?.tanks.find(t => t.id === tankId);
    if (!tank || secretKey !== '12345') {
      alert('Invalid secret key');
      return;
    }
    
    const now = new Date().toISOString();
    const updatedTank: Tank = {
      ...tank,
      sellingPrice: newPrice,
      expectedRevenue: tank.currentVolume * newPrice,
      lastUpdated: now,
      priceHistory: [
        ...tank.priceHistory,
        { id: Date.now(), tankId, price: newPrice, timestamp: now }
      ],
    };
    
    updateTank(updatedTank);
  };
  
  const handleUpdateVolume = (tankId: number, newVolume: number) => {
    const tank = station?.tanks.find(t => t.id === tankId);
    if (!tank) return;

    const now = new Date().toISOString();
    const volumeLog: VolumeLog = {
      id: Date.now(),
      tankId,
      stationId: id,
      previousVolume: tank.currentVolume,
      newVolume,
      timestamp: now,
    };

    const updatedTank: Tank = {
      ...tank,
      currentVolume: newVolume,
      expectedRevenue: newVolume * tank.sellingPrice,
      lastUpdated: now,
      volumeLog: [...(tank.volumeLog || []), volumeLog],
    };

    updateTank(updatedTank);
  };
  
  const handleDeleteTank = (tankId: number) => {
    if (window.confirm('Are you sure you want to delete this tank?')) {
      deleteTank(id, tankId);
    }
  };
  
  if (!station) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Station not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header title={`${station.name} - Tank Management`} showBack stationId={station.id} />
      
      <main className="page-container fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Database size={24} className="text-primary mr-2" />
                Tanks
              </h2>
              
              {isCEO && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  icon={<Plus size={20} />}
                >
                  Create Tank
                </Button>
              )}
            </div>
            
            {station.tanks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {station.tanks.map(tank => (
                  <TankCard
                    key={tank.id}
                    tank={tank}
                    isCEO={isCEO}
                    onUpdatePrice={handleUpdatePrice}
                    onUpdateVolume={handleUpdateVolume}
                    onDelete={handleDeleteTank}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Database size={48} className="text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No tanks available.</p>
                {isCEO && (
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    Create Your First Tank
                  </Button>
                )}
              </Card>
            )}
          </div>

          {isCEO && station.tanks.length > 0 && (
            <div className="lg:col-span-1">
              {station.tanks.map(tank => (
                <div key={tank.id} className="mb-6 last:mb-0">
                  <TankLogCard
                    logs={tank.volumeLog || []}
                    stationName={station.name}
                    tankName={tank.name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Tank"
        >
          <TankForm
            onSubmit={handleCreateTank}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      </main>
    </div>
  );
};

export default TankManagementPage;