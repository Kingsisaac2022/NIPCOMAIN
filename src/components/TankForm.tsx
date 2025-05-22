import React, { useState } from 'react';
import { Tank } from '../types';
import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import { Database, Lock } from 'lucide-react';

interface TankFormProps {
  onSubmit: (tank: Omit<Tank, 'id' | 'stationId' | 'priceHistory'>) => void;
  onCancel: () => void;
}

const TankForm: React.FC<TankFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [currentVolume, setCurrentVolume] = useState('');
  const [productType, setProductType] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const productTypeOptions = [
    { value: 'PMS', label: 'PMS (Premium Motor Spirit)' },
    { value: 'AGO', label: 'AGO (Automotive Gas Oil)' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Tank name is required';
    }

    if (!capacity || isNaN(parseFloat(capacity)) || parseFloat(capacity) <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }

    if (!currentVolume || isNaN(parseFloat(currentVolume)) || parseFloat(currentVolume) < 0) {
      newErrors.currentVolume = 'Valid current volume is required';
    } else if (parseFloat(currentVolume) > parseFloat(capacity)) {
      newErrors.currentVolume = 'Current volume cannot exceed capacity';
    }

    if (!productType) {
      newErrors.productType = 'Product type is required';
    }

    if (!sellingPrice || isNaN(parseFloat(sellingPrice)) || parseFloat(sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Valid selling price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newTank: Omit<Tank, 'id' | 'stationId' | 'priceHistory'> = {
      name: name.trim(),
      capacity: parseFloat(capacity),
      currentVolume: parseFloat(currentVolume),
      productType: productType as 'PMS' | 'AGO',
      sellingPrice: parseFloat(sellingPrice),
      expectedRevenue: parseFloat(currentVolume) * parseFloat(sellingPrice),
      status: 'Active',
      lastUpdated: new Date().toISOString(),
      secretKey: '12345', // Set default secret key
    };

    onSubmit(newTank);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Tank Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter tank name"
        required
        error={errors.name}
        icon={<Database size={20} />}
      />

      <SelectField
        label="Product Type"
        options={productTypeOptions}
        value={productType}
        onChange={(e) => setProductType(e.target.value)}
        required
        error={errors.productType}
      />

      <InputField
        label="Capacity (Liters)"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        placeholder="Enter tank capacity"
        required
        error={errors.capacity}
      />

      <InputField
        label="Current Volume (Liters)"
        type="number"
        value={currentVolume}
        onChange={(e) => setCurrentVolume(e.target.value)}
        placeholder="Enter current volume"
        required
        error={errors.currentVolume}
      />

      <InputField
        label="Selling Price (₦)"
        type="number"
        value={sellingPrice}
        onChange={(e) => setSellingPrice(e.target.value)}
        placeholder="Enter selling price per liter"
        required
        error={errors.sellingPrice}
      />

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" fullWidth>
          Create Tank
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TankForm;