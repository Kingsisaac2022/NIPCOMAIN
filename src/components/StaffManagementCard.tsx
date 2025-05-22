import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const StaffManagementCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Staff Management</h3>
          <p className="text-text-secondary mt-1">Manage station staff and roles</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Users size={24} className="text-primary" />
        </div>
      </div>

      <Button
        onClick={() => navigate('/ceo/staff')}
        variant="primary"
        fullWidth
        icon={<ArrowRight size={20} />}
      >
        Manage Staff
      </Button>
    </Card>
  );
};

export default StaffManagementCard;