import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle, Loader } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';
import Toast from '../components/Toast';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToastMessage('Please fill in all required fields correctly');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedStation = stations.find(s => s.id.toString() === stationId);
      
      if (!selectedStation) {
        throw new Error('Invalid station selected');
      }
      
      const now = new Date();
      const dateCreated = now.toISOString().split('T')[0];
      const timeCreated = now.toTimeString().split(' ')[0];
      
      await createPurchaseOrder({
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
      
      setToastMessage('Purchase Order successfully created');
      setToastType('success');
      setShowToast(true);

      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/ceo');
      }, 2000);
    } catch (error) {
      setToastMessage('Failed to create Purchase Order. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Create Purchase Order" showBack />
      
      <main className="page-container fade-in py-12">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
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
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Supplier Details</h3>
              
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
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Driver Details</h3>
              
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
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Product Cost & Revenue</h3>
              
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
            
            <div className="flex justify-end pt-6 border-t border-gray-700">
              <Button 
                type="submit" 
                variant="primary"
                size="lg"
                icon={isSubmitting ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default CreatePurchaseOrder;