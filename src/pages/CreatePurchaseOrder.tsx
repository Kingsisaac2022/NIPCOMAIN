import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';

const CreatePurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const { stations, createPurchaseOrder } = useAppContext();
  
  const stationOptions = stations
    .filter(station => station.id !== 1 && station.active)
    .map(station => ({
      value: station.id.toString(),
      label: station.name,
    }));
  
  const productTypeOptions = [
    { value: 'PMS', label: 'PMS (Premium Motor Spirit)' },
    { value: 'AGO', label: 'AGO (Automotive Gas Oil)' },
  ];
  
  const [stationId, setStationId] = useState('');
  const [productType, setProductType] = useState('');
  
  // Supplier details
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  
  // Driver details
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [truckInfo, setTruckInfo] = useState('');
  const [gpsTrackerId, setGpsTrackerId] = useState('');
  
  // Product details
  const [productCostPerUnit, setProductCostPerUnit] = useState('');
  const [totalVolume, setTotalVolume] = useState('');
  const [transportCost, setTransportCost] = useState('');
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState('');
  
  // Calculated fields
  const calculateTotalCost = () => {
    const costPerUnit = parseFloat(productCostPerUnit) || 0;
    const volume = parseFloat(totalVolume) || 0;
    return costPerUnit * volume;
  };
  
  const calculateFinalTotalCost = () => {
    const totalCost = calculateTotalCost();
    const transport = parseFloat(transportCost) || 0;
    return totalCost + transport;
  };
  
  const calculateExpectedRevenue = () => {
    const sellingPrice = parseFloat(sellingPricePerUnit) || 0;
    const volume = parseFloat(totalVolume) || 0;
    return sellingPrice * volume;
  };
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!stationId) {
      newErrors.stationId = 'Please select a station';
    }
    
    if (!productType) {
      newErrors.productType = 'Please select a product type';
    }
    
    if (!supplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required';
    }
    
    if (!supplierPhone.trim()) {
      newErrors.supplierPhone = 'Supplier phone is required';
    }
    
    if (!supplierAddress.trim()) {
      newErrors.supplierAddress = 'Supplier address is required';
    }
    
    if (!driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }
    
    if (!driverPhone.trim()) {
      newErrors.driverPhone = 'Driver phone is required';
    }
    
    if (!truckInfo.trim()) {
      newErrors.truckInfo = 'Truck information is required';
    }
    
    if (!gpsTrackerId.trim()) {
      newErrors.gpsTrackerId = 'GPS tracker ID is required';
    }
    
    if (!productCostPerUnit.trim() || isNaN(parseFloat(productCostPerUnit))) {
      newErrors.productCostPerUnit = 'Valid product cost is required';
    }
    
    if (!totalVolume.trim() || isNaN(parseFloat(totalVolume))) {
      newErrors.totalVolume = 'Valid total volume is required';
    }
    
    if (!transportCost.trim() || isNaN(parseFloat(transportCost))) {
      newErrors.transportCost = 'Valid transport cost is required';
    }
    
    if (!sellingPricePerUnit.trim() || isNaN(parseFloat(sellingPricePerUnit))) {
      newErrors.sellingPricePerUnit = 'Valid selling price is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const selectedStation = stations.find(s => s.id.toString() === stationId);
    
    if (!selectedStation) {
      setErrors({ stationId: 'Invalid station selected' });
      return;
    }
    
    const now = new Date();
    const dateCreated = now.toISOString().split('T')[0];
    const timeCreated = now.toTimeString().split(' ')[0];
    
    createPurchaseOrder({
      stationId: selectedStation.id,
      stationName: selectedStation.name,
      productType: productType as 'PMS' | 'AGO',
      supplierDetails: {
        name: supplierName,
        phone: supplierPhone,
        address: supplierAddress,
      },
      driverDetails: {
        name: driverName,
        phone: driverPhone,
        truckInfo,
        gpsTrackerId,
      },
      productCostPerUnit: parseFloat(productCostPerUnit),
      totalVolume: parseFloat(totalVolume),
      totalCost: calculateTotalCost(),
      transportCost: parseFloat(transportCost),
      finalTotalCost: calculateFinalTotalCost(),
      sellingPricePerUnit: parseFloat(sellingPricePerUnit),
      expectedRevenue: calculateExpectedRevenue(),
      dateCreated,
      timeCreated,
      status: 'Pending',
    });
    
    navigate('/ceo');
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Create Purchase Order" showBack />
      
      <main className="page-container fade-in py-12">
        <div className="card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-4">Station & Product</h3>
              
              <SelectField
                label="NIPCO Station"
                options={stationOptions}
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                required
                error={errors.stationId}
              />
              
              <SelectField
                label="Product Type"
                options={productTypeOptions}
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                required
                error={errors.productType}
              />
              
              <h3 className="text-lg font-bold my-4">Supplier Details</h3>
              
              <InputField
                label="Supplier Name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Enter supplier name"
                required
                error={errors.supplierName}
              />
              
              <InputField
                label="Supplier Phone Number"
                value={supplierPhone}
                onChange={(e) => setSupplierPhone(e.target.value)}
                placeholder="Enter supplier phone"
                required
                error={errors.supplierPhone}
              />
              
              <InputField
                label="Supplier Address"
                value={supplierAddress}
                onChange={(e) => setSupplierAddress(e.target.value)}
                placeholder="Enter supplier address"
                required
                error={errors.supplierAddress}
              />
              
              <h3 className="text-lg font-bold my-4">Driver Details</h3>
              
              <InputField
                label="Driver Name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Enter driver name"
                required
                error={errors.driverName}
              />
              
              <InputField
                label="Driver Phone Number"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="Enter driver phone"
                required
                error={errors.driverPhone}
              />
            </div>
            
            <div>
              <InputField
                label="Truck Information"
                value={truckInfo}
                onChange={(e) => setTruckInfo(e.target.value)}
                placeholder="Enter truck details"
                required
                error={errors.truckInfo}
              />
              
              <InputField
                label="GPS Tracker ID"
                value={gpsTrackerId}
                onChange={(e) => setGpsTrackerId(e.target.value)}
                placeholder="Enter GPS tracker ID"
                required
                error={errors.gpsTrackerId}
              />
              
              <h3 className="text-lg font-bold my-4">Product Cost & Revenue</h3>
              
              <InputField
                label="Product Cost Per Unit (₦)"
                type="number"
                value={productCostPerUnit}
                onChange={(e) => setProductCostPerUnit(e.target.value)}
                placeholder="Enter cost per unit"
                required
                error={errors.productCostPerUnit}
              />
              
              <InputField
                label="Total Volume (Liters)"
                type="number"
                value={totalVolume}
                onChange={(e) => setTotalVolume(e.target.value)}
                placeholder="Enter total volume"
                required
                error={errors.totalVolume}
              />
              
              <div className="mb-4">
                <label className="label">Total Cost (₦)</label>
                <div className="input-field bg-card-bg font-medium">
                  {calculateTotalCost().toLocaleString()}
                </div>
              </div>
              
              <InputField
                label="Transport Cost (₦)"
                type="number"
                value={transportCost}
                onChange={(e) => setTransportCost(e.target.value)}
                placeholder="Enter transport cost"
                required
                error={errors.transportCost}
              />
              
              <div className="mb-4">
                <label className="label">Final Total Cost (₦)</label>
                <div className="input-field bg-card-bg font-medium">
                  {calculateFinalTotalCost().toLocaleString()}
                </div>
              </div>
              
              <InputField
                label="Selling Price Per Unit (₦)"
                type="number"
                value={sellingPricePerUnit}
                onChange={(e) => setSellingPricePerUnit(e.target.value)}
                placeholder="Enter selling price per unit"
                required
                error={errors.sellingPricePerUnit}
              />
              
              <div className="mb-4">
                <label className="label">Expected Revenue (₦)</label>
                <div className="input-field bg-card-bg font-medium">
                  {calculateExpectedRevenue().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-700">
            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              icon={<Save size={20} />}
              onClick={handleSubmit}
            >
              Create Purchase Order
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CreatePurchaseOrder;