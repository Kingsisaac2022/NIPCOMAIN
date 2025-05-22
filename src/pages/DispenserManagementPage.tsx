import React, { useState } from 'react';
import { Plus, Gauge } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Card from '../components/Card';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import DispenserVolumeLogCard from '../components/DispenserVolumeLogCard';
import BottomNav from '../components/BottomNav';

interface NozzleInput {
  name: string;
}

const DispenserManagementPage: React.FC = () => {
  const { stations, updateStation } = useAppContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState('');
  const [dispenserName, setDispenserName] = useState('');
  const [productType, setProductType] = useState<'PMS' | 'AGO'>('PMS');
  const [selectedTank, setSelectedTank] = useState('');
  const [nozzles, setNozzles] = useState<NozzleInput[]>([{ name: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stationOptions = stations
    .filter(s => s.id !== 1 && s.active)
    .map(s => ({
      value: s.id.toString(),
      label: s.name
    }));

  const productOptions = [
    { value: 'PMS', label: 'PMS (Premium Motor Spirit)' },
    { value: 'AGO', label: 'AGO (Automotive Gas Oil)' }
  ];

  const selectedStationData = stations.find(s => s.id.toString() === selectedStation);
  const tankOptions = selectedStationData?.tanks
    .filter(tank => tank.productType === productType && tank.status === 'Active')
    .map(tank => ({
      value: tank.id.toString(),
      label: tank.name
    })) || [];

  const allVolumeLogs = stations
    .filter(s => s.id !== 1)
    .flatMap(station =>
      (station.dispensers || []).flatMap(dispenser =>
        dispenser.volumeLog.map(log => ({
          ...log,
          stationId: station.id,
          stationName: station.name,
          dispenserName: dispenser.name
        }))
      )
    );

  const handleAddNozzle = () => {
    if (nozzles.length < 2) {
      setNozzles([...nozzles, { name: '' }]);
    }
  };

  const handleRemoveNozzle = (index: number) => {
    setNozzles(nozzles.filter((_, i) => i !== index));
  };

  const handleNozzleChange = (index: number, value: string) => {
    const updatedNozzles = [...nozzles];
    updatedNozzles[index].name = value;
    setNozzles(updatedNozzles);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedStation) newErrors.station = 'Please select a station';
    if (!dispenserName.trim()) newErrors.name = 'Dispenser name is required';
    if (!selectedTank) newErrors.tank = 'Please select a tank';
    
    nozzles.forEach((nozzle, index) => {
      if (!nozzle.name.trim()) {
        newErrors[`nozzle${index}`] = 'Nozzle name is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const station = stations.find(s => s.id.toString() === selectedStation);
    if (!station) return;

    const newDispenser = {
      id: Date.now(),
      stationId: station.id,
      name: dispenserName.trim(),
      productType,
      tankId: parseInt(selectedTank),
      nozzles: nozzles.map((nozzle, index) => ({
        id: Date.now() + index + 1,
        dispenserId: Date.now(),
        name: nozzle.name,
        openingReading: 0,
        closingReading: 0
      })),
      volumeLog: []
    };

    const updatedStation = {
      ...station,
      dispensers: [...(station.dispensers || []), newDispenser]
    };

    updateStation(updatedStation);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedStation('');
    setDispenserName('');
    setProductType('PMS');
    setSelectedTank('');
    setNozzles([{ name: '' }]);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Dispenser Management" showBack />
      
      <main className="page-container fade-in py-12">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <Gauge size={24} className="text-primary mr-2" />
              Dispensers
            </h2>
            
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              icon={<Plus size={20} />}
            >
              Add Dispenser
            </Button>
          </div>

          <div className="space-y-6">
            {stations.filter(s => s.id !== 1).map(station => (
              station.dispensers?.map(dispenser => (
                <Card key={dispenser.id}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{dispenser.name}</h3>
                      <p className="text-text-secondary">{station.name}</p>
                    </div>
                    <span className={`
                      px-2 py-1 rounded-full text-sm font-medium
                      ${dispenser.productType === 'PMS' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-warning/10 text-warning'}
                    `}>
                      {dispenser.productType}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {dispenser.nozzles.map(nozzle => (
                      <div key={nozzle.id} className="p-4 bg-background rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{nozzle.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-secondary">Opening</span>
                            <p className="font-medium">{nozzle.openingReading}</p>
                          </div>
                          <div>
                            <span className="text-text-secondary">Closing</span>
                            <p className="font-medium">{nozzle.closingReading}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            ))}
          </div>

          <DispenserVolumeLogCard
            logs={allVolumeLogs}
            stationName="All Stations"
            dispenserName=""
            stations={stations.filter(s => s.id !== 1)}
          />
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            resetForm();
          }}
          title="Add New Dispenser"
        >
          <div className="space-y-6">
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

            <InputField
              label="Dispenser Name"
              value={dispenserName}
              onChange={(e) => setDispenserName(e.target.value)}
              placeholder="Enter dispenser name"
              required
              error={errors.name}
            />

            <SelectField
              label="Product Type"
              options={productOptions}
              value={productType}
              onChange={(e) => {
                setProductType(e.target.value as 'PMS' | 'AGO');
                setSelectedTank('');
              }}
              required
            />

            <SelectField
              label="Connect to Tank"
              options={tankOptions}
              value={selectedTank}
              onChange={(e) => setSelectedTank(e.target.value)}
              required
              error={errors.tank}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Nozzles</h3>
                {nozzles.length < 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddNozzle}
                    icon={<Plus size={16} />}
                  >
                    Add Nozzle
                  </Button>
                )}
              </div>

              {nozzles.map((nozzle, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <InputField
                      label={`Nozzle ${index + 1} Name`}
                      value={nozzle.name}
                      onChange={(e) => handleNozzleChange(index, e.target.value)}
                      placeholder="Enter nozzle name"
                      required
                      error={errors[`nozzle${index}`]}
                    />
                  </div>
                  {nozzles.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveNozzle(index)}
                      className="mt-8"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-700">
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                Create Dispenser
              </Button>
            </div>
          </div>
        </Modal>
      </main>

      <BottomNav />
    </div>
  );
};

export default DispenserManagementPage;