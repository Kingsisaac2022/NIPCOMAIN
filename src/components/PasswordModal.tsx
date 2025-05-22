import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import InputField from './InputField';
import Button from './Button';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stationId: number;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  stationId,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwords: Record<number, string> = {
      1: 'CEO#Nipco2025!',
      2: 'Station2@Abk#2025',
      3: 'Station3$Uyo1#25',
      4: 'Station4@Uyo2#25',
      5: 'Station5$Ikot#25',
      6: 'Station6@Ibaka#25'
    };

    if (password === passwords[stationId]) {
      setPassword('');
      setError('');
      onSuccess();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card-bg rounded-2xl border-2 border-gray-700 p-6 shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            required
            autoFocus
            icon={<Lock size={20} />}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;