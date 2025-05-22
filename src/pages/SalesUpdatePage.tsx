import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, Calculator } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import Card from '../components/Card';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';
import SalesLog from '../components/SalesLog';
import BottomNav from '../components/BottomNav';

const SalesUpdatePage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { getStation, updateStation } = useAppContext();
  
  const id = parseInt(stationId || '0');
  const station = getStation(id);
  
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedDispenser, setSelectedDispenser] = useState('');
  const [selectedNozzle, setSelectedNozzle] = useState('');
  const [shift, setShift] = useState<'Morning' | 'Afternoon'>('Morning');
  const [openingReading, setOpeningReading] = useState('');
  const [closingReading, setClosingReading] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!station) {
    return <div>Station not found</div>;
  }

  const staffOptions = station.staff?.map(s => ({
    value: s.id.toString(),
    label: s.name
  })) || [];

  const dispenserOptions = station.dispensers?.map(d => ({
    value: d.id.toString(),
    label: `${d.name} (${d.productType})`
  })) || [];

  const selectedDispenserData = station.dispensers?.find(
    d => d.id.toString() === selectedDispenser
  );

  const nozzleOptions = selectedDispenserData?.nozzles.map(n => ({
    value: n.id.toString(),
    label: n.name
  })) || [];

  const calculateVolume = () => {
    const opening = parseFloat(openingReading);
    const closing = parseFloat(closingReading);
    if (!isNaN(opening) && !isNaN(closing) && closing >= opening) {
      return closing - opening;
    }
    return 0;
  };

  const calculateRevenue = () => {
    const volume = calculateVolume();
    const dispenser = station.dispensers?.find(d => d.id.toString() === selectedDispenser);
    if (dispenser) {
      const tank = station.tanks.find(t => t.id === dispenser.tankId);
      if (tank) {
        return volume * tank.sellingPrice;
      }
    }
    return 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedStaff) newErrors.staff = 'Please select a staff member';
    if (!selectedDispenser) newErrors.dispenser = 'Please select a dispenser';
    if (!selectedNozzle) newErrors.nozzle = 'Please select a nozzle';
    if (!openingReading) newErrors.openingReading = 'Opening reading is required';
    if (!closingReading) newErrors.closingReading = 'Closing reading is required';

    const opening = parseFloat(openingReading);
    const closing = parseFloat(closingReading);

    if (isNaN(opening) || opening < 0) {
      newErrors.openingReading = 'Invalid opening reading';
    }
    if (isNaN(closing) || closing < 0) {
      newErrors.closingReading = 'Invalid closing reading';
    }
    if (closing < opening) {
      newErrors.closingReading = 'Closing reading must be greater than opening reading';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedStaffMember = station.staff?.find(s => s.id.toString() === selectedStaff);
    const selectedDispenserObj = station.dispensers?.find(d => d.id.toString() === selectedDispenser);
    const selectedNozzleObj = selectedDispenserObj?.nozzles.find(n => n.id.toString() === selectedNozzle);

    const newSalesEntry = {
      id: Date.now(),
      stationId: id,
      staffId: parseInt(selectedStaff),
      staffName: selectedStaffMember?.name || '',
      dispenserId: parseInt(selectedDispenser),
      dispenserName: selectedDispenserObj?.name || '',
      nozzleId: parseInt(selectedNozzle),
      nozzleName: selectedNozzleObj?.name || '',
      shift,
      openingReading: parseFloat(openingReading),
      closingReading: parseFloat(closingReading),
      volumeSold: calculateVolume(),
      revenue: calculateRevenue(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
    };

    const updatedStation = {
      ...station,
      sales: [...(station.sales || []), newSalesEntry],
    };

    updateStation(updatedStation);
    
    // Reset form
    setSelectedStaff('');
    setSelectedDispenser('');
    setSelectedNozzle('');
    setOpeningReading('');
    setClosingReading('');
  };

  const handleDownloadReport = () => {
    // Implementation for downloading report as PDF
    console.log('Downloading report...');
  };

  const handleSendToCEO = () => {
    // Implementation for sending report to CEO
    console.log('Sending report to CEO...');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Sales Management" showBack stationId={id} />
      
      <main className="page-container fade-in py-12">
        <div className="space-y-8">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Record Sales</h2>
                <p className="text-text-secondary">Enter sales information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <SelectField
                label="Staff Member"
                options={staffOptions}
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                required
                error={errors.staff}
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Shift"
                  options={[
                    { value: 'Morning', label: 'Morning Shift' },
                    { value: 'Afternoon', label: 'Afternoon Shift' },
                  ]}
                  value={shift}
                  onChange={(e) => setShift(e.target.value as 'Morning' | 'Afternoon')}
                  required
                />

                <SelectField
                  label="Dispenser"
                  options={dispenserOptions}
                  value={selectedDispenser}
                  onChange={(e) => {
                    setSelectedDispenser(e.target.value);
                    setSelectedNozzle('');
                  }}
                  required
                  error={errors.dispenser}
                />
              </div>

              <SelectField
                label="Nozzle"
                options={nozzleOptions}
                value={selectedNozzle}
                onChange={(e) => setSelectedNozzle(e.target.value)}
                required
                error={errors.nozzle}
                disabled={!selectedDispenser}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Opening Reading"
                  type="number"
                  value={openingReading}
                  onChange={(e) => setOpeningReading(e.target.value)}
                  required
                  error={errors.openingReading}
                />

                <InputField
                  label="Closing Reading"
                  type="number"
                  value={closingReading}
                  onChange={(e) => setClosingReading(e.target.value)}
                  required
                  error={errors.closingReading}
                />
              </div>

              {openingReading && closingReading && !errors.openingReading && !errors.closingReading && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-text-secondary mb-1">Volume Sold</p>
                    <p className="text-xl font-bold">{calculateVolume().toLocaleString()} L</p>
                  </div>

                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-text-secondary mb-1">Revenue</p>
                    <p className="text-xl font-bold text-primary">
                      ₦{calculateRevenue().toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-700">
                <Button
                  type="submit"
                  variant="primary"
                  icon={<Calculator size={20} />}
                >
                  Record Sales
                </Button>
              </div>
            </form>
          </Card>

          <SalesLog
            sales={station.sales || []}
            stationName={station.name}
            onDownload={handleDownloadReport}
            onSendToCEO={handleSendToCEO}
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SalesUpdatePage;