import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircuitBoard, Building2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { stations, playClickSound } = useAppContext();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStationSelect = (stationId: number) => {
    playClickSound();
    setSelectedStation(stationId);
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStation) return;

    const passwords: Record<number, string> = {
      1: 'CEO#Nipco2025!',
      2: 'Station2@Abk#2025',
      3: 'Station3$Uyo1#25',
      4: 'Station4@Uyo2#25',
      5: 'Station5$Ikot#25',
      6: 'Station6@Ibaka#25'
    };

    // Case-sensitive password check
    if (password === passwords[selectedStation]) {
      playClickSound();
      
      // Store authentication state
      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('stationId', selectedStation.toString());

      // Navigate to appropriate dashboard
      if (selectedStation === 1) {
        navigate('/ceo');
      } else {
        navigate(`/station/${selectedStation}`);
      }
    } else {
      setError('Invalid password');
    }
  };

  const handleBack = () => {
    playClickSound();
    setSelectedStation(null);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card-bg border-b border-white/5">
        <div className="page-container py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <CircuitBoard size={24} className="text-background" />
            </div>
            <h1 className="text-[64px] font-bold leading-tight">NIPCO Smart Station Manager</h1>
          </div>
          <p className="welcome-message">Welcome back. Please select your station to continue.</p>
        </div>
      </div>

      <main className="page-container py-12">
        {selectedStation === null ? (
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
        ) : (
          <div className="max-w-md mx-auto">
            <Card>
              <h2 className="text-xl font-bold mb-6">
                Enter Password for {stations.find(s => s.id === selectedStation)?.name}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error}
                  required
                  autoFocus
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    fullWidth
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                  >
                    Login
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoginPage;