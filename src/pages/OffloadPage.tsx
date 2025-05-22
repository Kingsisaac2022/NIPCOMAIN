import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, Droplet } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';

const OffloadPage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { getStation, createDriverOffload, purchaseOrders } = useAppContext();
  
  const id = parseInt(stationId || '0');
  const station = getStation(id);
  
  // Get active purchase orders for this station
  const stationPOs = purchaseOrders.filter(
    po => po.stationId === id && po.status === 'Active'
  );
  
  const poOptions = stationPOs.map(po => ({
    value: po.id.toString(),
    label: `${po.productType} - ${po.totalVolume.toLocaleString()} liters (${po.dateCreated})`
  }));
  
  const [activeTab, setActiveTab] = useState<'driver' | 'tank'>('driver');
  const [selectedPO, setSelectedPO] = useState('');
  const [driverName, setDriverName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [volumeArrived, setVolumeArrived] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleTabChange = (tab: 'driver' | 'tank') => {
    if (tab === 'tank') {
      navigate(`/station/${stationId}/tank-offload`);
    } else {
      setActiveTab(tab);
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedPO) {
      newErrors.selectedPO = 'Please select a purchase order';
    }
    
    if (!driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }
    
    if (!dateTime) {
      newErrors.dateTime = 'Date and time are required';
    }
    
    if (!volumeArrived.trim()) {
      newErrors.volumeArrived = 'Volume is required';
    } else if (isNaN(parseFloat(volumeArrived))) {
      newErrors.volumeArrived = 'Volume must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    createDriverOffload({
      orderId: parseInt(selectedPO),
      driverName,
      dateTime,
      volumeArrived: parseFloat(volumeArrived),
      status: 'Pending',
    });
    
    navigate(`/station/${stationId}`);
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
      <Header title={`${station.name} - Offload`} showBack stationId={station.id} />
      
      <main className="page-container fade-in">
        <div className="card">
          <div className="flex mb-6 border-b border-gray-700">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'driver'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
              onClick={() => handleTabChange('driver')}
            >
              <Truck size={20} className="inline-block mr-2" />
              Driver Offload
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'tank'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
              onClick={() => handleTabChange('tank')}
            >
              <Droplet size={20} className="inline-block mr-2" />
              Tank Offload
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <SelectField
              label="Purchase Order"
              options={poOptions}
              value={selectedPO}
              onChange={(e) => setSelectedPO(e.target.value)}
              required
              error={errors.selectedPO}
            />
            
            <InputField
              label="Driver Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Enter driver name"
              required
              error={errors.driverName}
            />
            
            <InputField
              label="Date & Time"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              error={errors.dateTime}
            />
            
            <InputField
              label="Volume Arrived (Liters)"
              type="number"
              value={volumeArrived}
              onChange={(e) => setVolumeArrived(e.target.value)}
              placeholder="Enter volume in liters"
              required
              error={errors.volumeArrived}
            />
            
            <div className="flex justify-end mt-6">
              <Button 
                type="submit" 
                variant="primary"
                icon={<Truck size={20} />}
              >
                Record Offload
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OffloadPage;