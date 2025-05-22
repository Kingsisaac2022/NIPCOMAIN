import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import InputField from '../components/InputField';
import FileUpload from '../components/FileUpload';
import Card from '../components/Card';
import ActivityLog from '../components/ActivityLog';
import BottomNav from '../components/BottomNav';

const CEOPage: React.FC = () => {
  const navigate = useNavigate();
  const { stations, purchaseOrders, updateStation, getStation } = useAppContext();
  
  const ceo = getStation(1);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (ceo) {
      setManagerName(ceo.managerName || '');
      setManagerPhone(ceo.managerPhone || '');
      setAddress(ceo.address || '');
    }
  }, [ceo]);
  
  const pendingOrders = purchaseOrders.filter(order => order.status === 'Pending');
  const activeOrders = purchaseOrders.filter(order => order.status === 'Active');
  
  const activeTanks = stations.flatMap(station => 
    station.tanks?.filter(tank => tank.status === 'Active') || []
  );

  const totalPMSVolume = activeTanks
    .filter(tank => tank.productType === 'PMS')
    .reduce((sum, tank) => sum + tank.currentVolume, 0);

  const totalAGOVolume = activeTanks
    .filter(tank => tank.productType === 'AGO')
    .reduce((sum, tank) => sum + tank.currentVolume, 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!managerName.trim()) {
      newErrors.managerName = 'Name is required';
    }
    
    if (!managerPhone.trim()) {
      newErrors.managerPhone = 'Phone number is required';
    }
    
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!ceo || !validateForm()) return;
    
    const updatedCEO = {
      ...ceo,
      managerName: managerName.trim(),
      managerPhone: managerPhone.trim(),
      address: address.trim(),
    };
    
    updateStation(updatedCEO);
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  const handleFileSelected = (file: File) => {
    if (!ceo) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const updatedCEO = {
          ...ceo,
          managerPhoto: reader.result as string
        };
        updateStation(updatedCEO);
      }
    };
    reader.readAsDataURL(file);
  };
  
  if (!ceo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Loading...</p>
      </div>
    );
  }

  // Mock activities for demonstration
  const recentActivities = [
    {
      id: 1,
      type: 'tank' as const,
      message: 'Tank PMS-01 volume updated',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      type: 'sales' as const,
      message: 'Daily sales report generated',
      timestamp: new Date().toISOString()
    }
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="CEO Dashboard" showBack stationId={1} />
      
      <main className="page-container py-12 space-y-8">
        <Card>
          <h2 className="text-xl font-bold mb-6">CEO Information</h2>
          
          <InputField
            label="Name"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="Enter CEO name"
            required
            error={errors.managerName}
            icon={<User size={20} />}
          />
          
          <InputField
            label="Phone Number"
            value={managerPhone}
            onChange={(e) => setManagerPhone(e.target.value)}
            placeholder="Enter phone number"
            required
            error={errors.managerPhone}
            icon={<Phone size={20} />}
          />
          
          <InputField
            label="Office Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter office address"
            required
            error={errors.address}
            icon={<MapPin size={20} />}
          />
          
          <FileUpload
            label="Profile Photo"
            onFileSelected={handleFileSelected}
            accept="image/*"
            preview={ceo?.managerPhoto}
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
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-6">Purchase Orders Log</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Active Orders ({activeOrders.length})</h3>
              
              {activeOrders.length > 0 ? (
                <div className="space-y-4">
                  {activeOrders.map(order => (
                    <div key={order.id} className="p-4 bg-background rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{order.stationName}</h4>
                          <p className="text-text-secondary text-sm">
                            {order.productType} - {order.totalVolume.toLocaleString()} liters
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            Created on {order.dateCreated} at {order.timeCreated}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/ceo/purchase-order/${order.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary">No active orders.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Pending Orders ({pendingOrders.length})</h3>
              
              {pendingOrders.length > 0 ? (
                <div className="space-y-4">
                  {pendingOrders.map(order => (
                    <div key={order.id} className="p-4 bg-background rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{order.stationName}</h4>
                          <p className="text-text-secondary text-sm">
                            {order.productType} - {order.totalVolume.toLocaleString()} liters
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            Created on {order.dateCreated} at {order.timeCreated}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/ceo/purchase-order/${order.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary">No pending orders.</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-6">Tank Overview</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <p className="text-text-secondary text-sm">Total Active Tanks</p>
                <p className="text-2xl font-bold text-primary">{activeTanks.length}</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg">
                <p className="text-text-secondary text-sm">Total PMS Volume</p>
                <p className="text-2xl font-bold">{totalPMSVolume.toLocaleString()} L</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg">
                <p className="text-text-secondary text-sm">Total AGO Volume</p>
                <p className="text-2xl font-bold">{totalAGOVolume.toLocaleString()} L</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-6">Station Tanks</h2>
          <div className="space-y-6">
            {stations
              .filter(s => s.id !== 1 && s.active && s.tanks?.length > 0)
              .map(station => (
                <div key={station.id} className="p-4 bg-background rounded-lg">
                  <h3 className="font-bold mb-4">{station.name}</h3>
                  <div className="space-y-4">
                    {station.tanks.map(tank => (
                      <div key={tank.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{tank.name}</p>
                          <p className="text-text-secondary text-sm">
                            {tank.productType} - {tank.currentVolume.toLocaleString()} / {tank.capacity.toLocaleString()} L
                          </p>
                        </div>
                        <span className={`
                          px-2 py-1 rounded-full text-sm
                          ${tank.status === 'Active' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-error/10 text-error'}
                        `}>
                          {tank.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-6">Orders Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg">
              <p className="text-text-secondary text-sm">Active Orders</p>
              <p className="text-2xl font-bold text-primary">{activeOrders.length}</p>
            </div>
            
            <div className="p-4 bg-background rounded-lg">
              <p className="text-text-secondary text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-warning">{pendingOrders.length}</p>
            </div>
            
            <div className="p-4 bg-background rounded-lg">
              <p className="text-text-secondary text-sm">Total Volume (Active)</p>
              <p className="text-2xl font-bold">
                {activeOrders.reduce((sum, order) => sum + order.totalVolume, 0).toLocaleString()} L
              </p>
            </div>
          </div>
        </Card>

        <ActivityLog activities={recentActivities} />
      </main>

      <BottomNav />
    </div>
  );
};

export default CEOPage;