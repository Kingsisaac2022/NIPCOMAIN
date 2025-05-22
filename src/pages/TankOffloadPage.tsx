import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';

const TankOffloadPage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { getStation, purchaseOrders, createTankOffload } = useAppContext();
  
  const id = parseInt(stationId || '0');
  const station = getStation(id);
  
  // Get active purchase orders for this station
  const activePOs = purchaseOrders.filter(
    po => po.stationId === id && po.status === 'Active'
  );
  
  const poOptions = activePOs.map(po => ({
    value: po.id.toString(),
    label: `${po.productType} - ${po.totalVolume.toLocaleString()} liters (${po.dateCreated})`
  }));
  
  const [selectedPO, setSelectedPO] = useState('');
  const [selectedTank, setSelectedTank] = useState('');
  const [openingVolume, setOpeningVolume] = useState('');
  const [offloadVolume, setOffloadVolume] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get available tanks based on selected PO's product type
  const selectedOrder = activePOs.find(po => po.id.toString() === selectedPO);
  const availableTanks = (station?.tanks || []).filter(
    tank => tank.status === 'Active' && tank.productType === selectedOrder?.productType
  );
  
  const tankOptions = availableTanks.map(tank => ({
    value: tank.id.toString(),
    label: `${tank.name} (Current: ${tank.currentVolume.toLocaleString()} L)`
  }));
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedPO) {
      newErrors.selectedPO = 'Please select a purchase order';
    }
    
    if (!selectedTank) {
      newErrors.selectedTank = 'Please select a tank';
    }
    
    if (!openingVolume.trim() || isNaN(parseFloat(openingVolume))) {
      newErrors.openingVolume = 'Valid opening volume is required';
    }
    
    if (!offloadVolume.trim() || isNaN(parseFloat(offloadVolume))) {
      newErrors.offloadVolume = 'Valid offload volume is required';
    }
    
    const tank = availableTanks.find(t => t.id.toString() === selectedTank);
    if (tank) {
      const finalVolume = parseFloat(openingVolume) + parseFloat(offloadVolume);
      if (finalVolume > tank.capacity) {
        newErrors.offloadVolume = 'Final volume would exceed tank capacity';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const tankId = parseInt(selectedTank);
    const opening = parseFloat(openingVolume);
    const offload = parseFloat(offloadVolume);
    
    createTankOffload({
      tankId,
      orderId: parseInt(selectedPO),
      openingVolume: opening,
      offloadVolume: offload,
      finalVolume: opening + offload,
      dateTime: new Date().toISOString(),
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
      <Header title={`${station.name} - Tank Offload`} showBack stationId={station.id} />
      
      <main className="page-container fade-in">
        <div className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Droplet size={24} className="text-primary mr-2" />
            Tank Offload Form
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <SelectField
              label="Purchase Order"
              options={poOptions}
              value={selectedPO}
              onChange={(e) => {
                setSelectedPO(e.target.value);
                setSelectedTank(''); // Reset tank selection when PO changes
              }}
              required
              error={errors.selectedPO}
            />
            
            <SelectField
              label="Select Tank"
              options={tankOptions}
              value={selectedTank}
              onChange={(e) => setSelectedTank(e.target.value)}
              required
              error={errors.selectedTank}
              disabled={!selectedPO}
            />
            
            {selectedTank && (
              <div className="pt-4 border-t border-gray-700">
                <InputField
                  label="Opening Volume (Liters)"
                  type="number"
                  value={openingVolume}
                  onChange={(e) => setOpeningVolume(e.target.value)}
                  placeholder="Enter opening volume"
                  required
                  error={errors.openingVolume}
                />
                
                <InputField
                  label="Offload Volume (Liters)"
                  type="number"
                  value={offloadVolume}
                  onChange={(e) => setOffloadVolume(e.target.value)}
                  placeholder="Enter offload volume"
                  required
                  error={errors.offloadVolume}
                />
                
                {openingVolume && offloadVolume && !errors.offloadVolume && (
                  <div className="mt-4 p-4 bg-background rounded-lg">
                    <p className="text-text-secondary">Final Volume</p>
                    <p className="text-2xl font-bold text-primary">
                      {(parseFloat(openingVolume) + parseFloat(offloadVolume)).toLocaleString()} L
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end pt-6 border-t border-gray-700">
              <Button 
                type="submit" 
                variant="primary"
                icon={<Droplet size={20} />}
              >
                Complete Offload
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TankOffloadPage;