import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import FileUpload from '../components/FileUpload';
import StaffCard from '../components/StaffCard';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';
import { Staff } from '../types';

const StaffPage: React.FC = () => {
  const { stations, updateStation } = useAppContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    stationId: '',
    // Guarantor details
    guarantorName: '',
    guarantorPhone: '',
    guarantorEmail: '',
    guarantorAddress: '',
    guarantorRelationship: '',
  });
  const [staffPhoto, setStaffPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleOptions = [
    { value: 'Station Attendant', label: 'Station Attendant' },
    { value: 'Security', label: 'Security' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Accountant', label: 'Accountant' },
  ];

  const stationOptions = stations
    .filter(s => s.id !== 1 && s.active)
    .map(s => ({
      value: s.id.toString(),
      label: s.name,
    }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.stationId) newErrors.stationId = 'Station is required';
    
    // Guarantor validation
    if (!formData.guarantorName.trim()) newErrors.guarantorName = 'Guarantor name is required';
    if (!formData.guarantorPhone.trim()) newErrors.guarantorPhone = 'Guarantor phone is required';
    if (!formData.guarantorEmail.trim()) newErrors.guarantorEmail = 'Guarantor email is required';
    if (!formData.guarantorAddress.trim()) newErrors.guarantorAddress = 'Guarantor address is required';
    if (!formData.guarantorRelationship.trim()) newErrors.guarantorRelationship = 'Relationship is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    let photoUrl = '';
    if (staffPhoto) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          photoUrl = reader.result as string;
          resolve();
        };
        reader.readAsDataURL(staffPhoto);
      });
    }

    const newStaff: Staff = {
      id: Date.now(),
      stationId: parseInt(formData.stationId),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      photo: photoUrl,
      dateEmployed: new Date().toISOString(),
      guarantor: {
        name: formData.guarantorName,
        phone: formData.guarantorPhone,
        email: formData.guarantorEmail,
        address: formData.guarantorAddress,
        relationship: formData.guarantorRelationship,
      },
    };

    const station = stations.find(s => s.id === parseInt(formData.stationId));
    if (station) {
      const updatedStation = {
        ...station,
        staff: [...(station.staff || []), newStaff],
      };
      updateStation(updatedStation);
    }

    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      stationId: '',
      guarantorName: '',
      guarantorPhone: '',
      guarantorEmail: '',
      guarantorAddress: '',
      guarantorRelationship: '',
    });
    setStaffPhoto(null);
  };

  // Filter staff based on search and selected station
  const allStaff = stations.flatMap(station => 
    (station.staff || []).map(staff => ({
      ...staff,
      stationName: station.name,
    }))
  );

  const filteredStaff = allStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStation = selectedStation ? staff.stationId.toString() === selectedStation : true;
    return matchesSearch && matchesStation;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Staff Management" showBack />

      <main className="page-container fade-in py-12">
        <div className="space-y-8">
          {/* Staff Creation Form */}
          <Card>
            <h2 className="text-xl font-bold mb-6">Add New Staff</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Staff Information</h3>
                
                <SelectField
                  label="Station"
                  options={stationOptions}
                  value={formData.stationId}
                  onChange={(e) => setFormData(prev => ({ ...prev, stationId: e.target.value }))}
                  required
                  error={errors.stationId}
                />

                <InputField
                  label="Full Name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  error={errors.name}
                />

                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  error={errors.email}
                />

                <InputField
                  label="Phone Number"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  error={errors.phone}
                />

                <SelectField
                  label="Role"
                  options={roleOptions}
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  required
                  error={errors.role}
                />

                <FileUpload
                  label="Staff Photo"
                  onFileSelected={setStaffPhoto}
                  accept="image/*"
                />
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-bold">Guarantor Information</h3>

                <InputField
                  label="Guarantor Name"
                  id="guarantorName"
                  value={formData.guarantorName}
                  onChange={handleInputChange}
                  required
                  error={errors.guarantorName}
                />

                <InputField
                  label="Guarantor Phone"
                  id="guarantorPhone"
                  value={formData.guarantorPhone}
                  onChange={handleInputChange}
                  required
                  error={errors.guarantorPhone}
                />

                <InputField
                  label="Guarantor Email"
                  id="guarantorEmail"
                  type="email"
                  value={formData.guarantorEmail}
                  onChange={handleInputChange}
                  required
                  error={errors.guarantorEmail}
                />

                <InputField
                  label="Guarantor Address"
                  id="guarantorAddress"
                  value={formData.guarantorAddress}
                  onChange={handleInputChange}
                  required
                  error={errors.guarantorAddress}
                />

                <InputField
                  label="Relationship with Staff"
                  id="guarantorRelationship"
                  value={formData.guarantorRelationship}
                  onChange={handleInputChange}
                  required
                  error={errors.guarantorRelationship}
                />
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-700">
                <Button type="submit" variant="primary">
                  Add Staff Member
                </Button>
              </div>
            </form>
          </Card>

          {/* Staff List */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Staff Directory</h2>
              <div className="flex gap-4">
                <SelectField
                  label=""
                  options={[
                    { value: '', label: 'All Stations' },
                    ...stationOptions,
                  ]}
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                />
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStaff.map(staff => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  stationName={staff.stationName}
                />
              ))}
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary">No staff members found</p>
              </div>
            )}
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default StaffPage;