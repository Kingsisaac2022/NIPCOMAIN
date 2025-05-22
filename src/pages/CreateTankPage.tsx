import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import TankForm from '../components/TankForm';
import BottomNav from '../components/BottomNav';
import { Tank } from '../types';
import { useAppContext } from '../context/AppContext';

const CreateTankPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTank } = useAppContext();

  const handleCreateTank = (tankData: Omit<Tank, 'id' | 'stationId' | 'priceHistory'>) => {
    createTank(1, tankData); // Using CEO's station ID (1)
    navigate('/ceo');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Create New Tank" showBack />
      
      <main className="page-container fade-in py-12">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Database size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Create Tank</h2>
              <p className="text-text-secondary">Add a new tank to the system</p>
            </div>
          </div>

          <TankForm
            onSubmit={handleCreateTank}
            onCancel={() => navigate('/ceo')}
          />
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default CreateTankPage;