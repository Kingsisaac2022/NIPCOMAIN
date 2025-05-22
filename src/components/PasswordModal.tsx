import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import Modal from './Modal';
import InputField from './InputField';
import Button from './Button';
import AuthService from '../services/AuthService';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const authService = AuthService.getInstance();

    if (authService.validatePassword(stationId, password)) {
      setPassword('');
      setError('');
      onSuccess();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Password"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          icon={<Lock size={20} />}
          required
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            icon={<Lock size={20} />}
          >
            Unlock Access
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordModal;