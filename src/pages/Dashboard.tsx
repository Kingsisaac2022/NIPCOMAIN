import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { CircuitBoard, Calendar, Clock } from 'lucide-react';
import Header from '../components/Header';
import StationCard from '../components/StationCard';
import Footer from '../components/Footer';
import PasswordModal from '../components/PasswordModal';

const Dashboard: React.FC = () => {
  const { stations } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStationClick = (stationId: number) => {
    setSelectedStation(stationId);
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    const redirectPath = selectedStation === 1 ? '/ceo' : `/station/${selectedStation}`;
    window.location.href = redirectPath;
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card-bg border-b border-white/5">
        <div className="page-container py-6">
          <div className="flex justify-end gap-6 mb-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <Calendar size={20} className="text-primary" />
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock size={20} className="text-primary" />
              <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <CircuitBoard size={20} className="text-background" />
            </div>
            <h1 className="text-4xl font-bold leading-tight">NIPCO Smart Station Manager</h1>
          </div>
          <p className="welcome-message">Welcome back. Ready to manage your station?</p>
        </div>
      </div>
      
      <main className="page-container py-12 flex-1 fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stations?.map((station) => (
            <StationCard 
              key={station.id} 
              station={station} 
              onClick={() => handleStationClick(station.id)}
            />
          ))}
          {!stations?.length && (
            <div className="col-span-full text-center py-8 text-text-secondary">
              No stations available
            </div>
          )}
        </div>
      </main>

      <Footer />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        stationId={selectedStation || 0}
      />
    </div>
  );
};

export default Dashboard;