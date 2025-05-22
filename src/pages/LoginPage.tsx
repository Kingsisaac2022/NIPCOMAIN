import React, { useState } from 'react';
import { CircuitBoard, Building2, Calendar, Clock } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAppContext } from '../context/AppContext';
import PasswordModal from '../components/PasswordModal';

const LoginPage: React.FC = () => {
  const { stations, playClickSound } = useAppContext();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStationSelect = (stationId: number) => {
    playClickSound();
    setSelectedStation(stationId);
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    if (!selectedStation) return;
    
    // Store authentication state
    sessionStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('stationId', selectedStation.toString());

    // Navigate to appropriate dashboard
    if (selectedStation === 1) {
      window.location.href = '/ceo';
    } else {
      window.location.href = `/station/${selectedStation}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
          <div className="flex justify-center">
            <p className="welcome-message">Welcome back</p>
          </div>
        </div>
      </div>

      <main className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stations.map(station => (
            <Card
              key={station.id}
              onClick={() => station.active && handleStationSelect(station.id)}
              className={`
                relative flex overflow-hidden rounded-xl transition-all duration-300 h-[400px]
                ${station.active ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-60 cursor-not-allowed'} 
                ${station.active && 'hover:shadow-2xl'}
              `}
            >
              {/* Left Content Area */}
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors">
                    {station.name}
                  </h3>
                  <div className="text-lg text-text-secondary mt-2">
                    {station.managerName || 'No manager assigned'}
                  </div>
                </div>

                <div className="mt-auto">
                  <span className={`
                    inline-block text-sm font-medium px-4 py-2 rounded-full
                    ${station.active 
                      ? 'bg-success/10 text-success' 
                      : 'bg-inactive/10 text-inactive'}
                  `}>
                    {station.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {station.active && (
                  <div className="space-y-4 mt-4">
                    {station.address && (
                      <div className="flex items-center">
                        <div className="bg-background rounded-lg p-2.5 mr-3">
                          <Building2 size={18} className="text-primary" />
                        </div>
                        <span className="text-text-secondary line-clamp-1">
                          {station.address}
                        </span>
                      </div>
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
                  <div className="w-full h-full bg-gradient-to-br from-yellow-500/5 to-yellow-500/10" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        stationId={selectedStation || 0}
      />
    </div>
  );
};

export default LoginPage;