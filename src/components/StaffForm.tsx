import React, { useState } from 'react';
import { User, Phone, Mail, Briefcase, Save, Loader } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import InputField from './InputField';
import SelectField from './SelectField';
import FileUpload from './FileUpload';
import Button from './Button';
import Toast from './Toast';

interface StaffFormProps {
  stationId: number;
  onSuccess?: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ stationId, onSuccess }) => {
  const { updateStation, getStation } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    // Clear error when field is modified
    if (errors[e.target.id]) {
      setErrors(prev => ({ ...prev, [e.target.id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Staff details validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role) newErrors.role = 'Role is required';
    
    // Guarantor validation
    if (!formData.guarantorName.trim()) newErrors.guarantorName = 'Guarantor name is required';
    if (!formData.guarantorPhone.trim()) newErrors.guarantorPhone = 'Guarantor phone is required';
    if (!formData.guarantorEmail.trim()) newErrors.guarantorEmail = 'Guarantor email is required';
    if (!formData.guarantorAddress.trim()) newErrors.guarantorAddress = 'Guarantor address is required';
    if (!formData.guarantorRelationship.trim()) newErrors.guarantorRelationship = 'Relationship is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.guarantorEmail && !emailRegex.test(formData.guarantorEmail)) {
      newErrors.guarantorEmail = 'Invalid guarantor email format';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    if (formData.guarantorPhone && !phoneRegex.test(formData.guarantorPhone)) {
      newErrors.guarantorPhone = 'Invalid guarantor phone number format';
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
      const station = getStation(stationId);
      if (!station) throw new Error('Station not found');

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

      const newStaff = {
        id: Date.now(),
        stationId,
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

      const updatedStation = {
        ...station,
        staff: [...(station.staff || []), newStaff],
      };

      updateStation(updatedStation);
      
      setToastMessage('Staff member added successfully');
      setToastType('success');
      setShowToast(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        guarantorName: '',
        guarantorPhone: '',
        guarantorEmail: '',
        guarantorAddress: '',
        guarantorRelationship: '',
      });
      setStaffPhoto(null);
      
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      setToastMessage('Failed to add staff member. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Staff Information</h3>
        
        <InputField
          label="Full Name"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          error={errors.name}
          icon={<User size={20} />}
        />

        <InputField
          label="Email"
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          error={errors.email}
          icon={<Mail size={20} />}
        />

        <InputField
          label="Phone Number"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          error={errors.phone}
          icon={<Phone size={20} />}
        />

        <SelectField
          label="Role"
          id="role"
          options={roleOptions}
          value={formData.role}
          onChange={handleInputChange}
          required
          error={errors.role}
          icon={<Briefcase size={20} />}
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
          icon={<User size={20} />}
        />

        <InputField
          label="Guarantor Phone"
          id="guarantorPhone"
          value={formData.guarantorPhone}
          onChange={handleInputChange}
          required
          error={errors.guarantorPhone}
          icon={<Phone size={20} />}
        />

        <InputField
          label="Guarantor Email"
          id="guarantorEmail"
          type="email"
          value={formData.guarantorEmail}
          onChange={handleInputChange}
          required
          error={errors.guarantorEmail}
          icon={<Mail size={20} />}
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
        <Button
          type="submit"
          variant="primary"
          icon={isSubmitting ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Staff...' : 'Add Staff Member'}
        </Button>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </form>
  );
};

export default StaffForm;