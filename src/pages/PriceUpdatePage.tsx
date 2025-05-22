import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Save, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import SelectField from '../components/SelectField';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';
import BottomNav from '../components/BottomNav';

const PriceUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const { stations, updateTank } = useAppContext();
  
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedTank, setSelectedTank] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeStations = stations.filter(s => s.id !== 1 && s.active);
  
  const stationOptions = activeStations.map(station => ({
    value: station.id.toString(),
    label: station.name
  }));

  const productOptions = [
    { value: 'PMS', label: 'PMS (Premium Motor Spirit)' },
    { value: 'AGO', label: 'AGO (Automotive Gas Oil)' }
  ];

  const selectedStationData = activeStations.find(s => s.id.toString() === selectedStation);
  const tankOptions = selectedStationData?.tanks
    .filter(tank => tank.productType === selectedProduct && tank.status === 'Active')
    .map(tank => ({
      value: tank.id.toString(),
      label: `${tank.name} (Current: ₦${tank.sellingPrice}/L)`
    })) || [];

  const selectedTankData = selectedStationData?.tanks.find(t => t.id.toString() === selectedTank);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedStation) {
      newErrors.station = 'Please select a station';
    }

    if (!selectedProduct) {
      newErrors.product = 'Please select a product type';
    }

    if (!selectedTank) {
      newErrors.tank = 'Please select a tank';
    }

    if (!newPrice || isNaN(parseFloat(newPrice)) || parseFloat(newPrice) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!secretKey) {
      newErrors.secretKey = 'Secret key is required';
    } else if (secretKey !== '12345') {
      newErrors.secretKey = 'Invalid secret key';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedTankData) return;

    const price = parseFloat(newPrice);
    const now = new Date().toISOString();

    const updatedTank = {
      ...selectedTankData,
      sellingPrice: price,
      expectedRevenue: selectedTankData.currentVolume * price,
      lastUpdated: now,
      priceHistory: [
        ...selectedTankData.priceHistory,
        { id: Date.now(), tankId: selectedTankData.id, price, timestamp: now }
      ]
    };

    updateTank(updatedTank);
    navigate('/ceo');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Update Tank Prices" showBack />
      
      <main className="page-container fade-in py-12">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <SelectField
              label="Select Station"
              options={stationOptions}
              value={selectedStation}
              onChange={(e) => {
                setSelectedStation(e.target.value);
                setSelectedTank('');
              }}
              required
              error={errors.station}
            />

            <SelectField
              label="Product Type"
              options={productOptions}
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedTank('');
              }}
              required
              error={errors.product}
            />

            <SelectField
              label="Select Tank"
              options={tankOptions}
              value={selectedTank}
              onChange={(e) => setSelectedTank(e.target.value)}
              required
              error={errors.tank}
              disabled={!selectedProduct || !selectedStation}
            />

            {selectedTankData && (
              <div className="pt-6 border-t border-gray-700">
                <InputField
                  label="New Price (₦)"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter new price per liter"
                  required
                  error={errors.price}
                  icon={<DollarSign size={20} />}
                />

                <InputField
                  label="Secret Key"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter tank secret key"
                  required
                  error={errors.secretKey}
                  icon={<Lock size={20} />}
                />

                {newPrice && !errors.price && (
                  <div className="mt-6 p-4 bg-background rounded-lg">
                    <h4 className="text-lg font-bold mb-4">Price Update Preview</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Current Price</span>
                        <span>₦{selectedTankData.sellingPrice}/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">New Price</span>
                        <span className="text-primary">₦{parseFloat(newPrice)}/L</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-700">
                        <span className="text-text-secondary">New Expected Revenue</span>
                        <span className="text-primary font-bold">
                          ₦{(selectedTankData.currentVolume * parseFloat(newPrice)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-700">
              <Button
                type="submit"
                variant="primary"
                icon={<Save size={20} />}
              >
                Update Price
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default PriceUpdatePage;