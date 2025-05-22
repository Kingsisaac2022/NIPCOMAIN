import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, DollarSign, Database, Users, Phone, MapPin, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import InputField from '../components/InputField';
import FileUpload from '../components/FileUpload';
import ActionCard from '../components/ActionCard';

const StationPage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { getStation, updateStation, playClickSound } = useAppContext();
  
  const id = parseInt(stationId || '0');
  const station = getStation(id);
  
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (station) {
      setManagerName(station.managerName || '');
      setManagerPhone(station.managerPhone || '');
      setAddress(station.address || '');
    }
  }, [station]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!managerName.trim()) {
      newErrors.managerName = 'Manager name is required';
    }
    
    if (!managerPhone.trim()) {
      newErrors.managerPhone = 'Manager phone is required';
    }
    
    if (!address.trim()) {
      newErrors.address = 'Station address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!station || !validateForm()) return;
    
    playClickSound();
    
    const updatedStation = {
      ...station,
      managerName: managerName.trim(),
      managerPhone: managerPhone.trim(),
      address: address.trim(),
    };
    
    updateStation(updatedStation);
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  const handleFileSelected = (file: File) => {
    if (!station) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const updatedStation = {
          ...station,
          managerPhoto: reader.result as string
        };
        updateStation(updatedStation);
      }
    };
    reader.readAsDataURL(file);
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
      <Header title={station.name} showBack stationId={station.id} />
      
      <main className="page-container fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="card mb-8">
              <h2 className="text-xl font-bold mb-6">Manager Information</h2>
              
              <InputField
                label="Manager Name"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Enter manager name"
                required
                error={errors.managerName}
                icon={<Users size={20} />}
              />
              
              <InputField
                label="Manager Phone Number"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                placeholder="Enter phone number"
                required
                error={errors.managerPhone}
                icon={<Phone size={20} />}
              />
              
              <InputField
                label="Station Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter station address"
                required
                error={errors.address}
                icon={<MapPin size={20} />}
              />
              
              <FileUpload
                label="Manager Passport Photo"
                onFileSelected={handleFileSelected}
                accept="image/*"
                preview={station.managerPhoto}
              />
              
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
                {saveSuccess && (
                  <div className="flex items-center text-success">
                    <Check size={20} className="mr-2" />
                    <span>Information saved successfully!</span>
                  </div>
                )}
                <Button 
                  onClick={handleSave}
                  icon={<Check size={20} />}
                >
                  Save Information
                </Button>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4">Station Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ActionCard
                  title="Driver Offload"
                  icon={<Truck size={28} />}
                  route={`/station/${station.id}/offload`}
                />
                
                <ActionCard
                  title="Tank Offload"
                  icon={<Database size={28} />}
                  route={`/station/${station.id}/tank-offload`}
                />
                
                <ActionCard
                  title="Manage Tanks"
                  icon={<Database size={28} />}
                  route={`/station/${station.id}/tanks`}
                />

                <ActionCard
                  title="Manage Staff"
                  icon={<Users size={28} />}
                  route={`/station/${station.id}/staff`}
                />
                
                <ActionCard
                  title="Sales"
                  icon={<DollarSign size={28} />}
                  route={`/station/${station.id}/sales`}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StationPage;