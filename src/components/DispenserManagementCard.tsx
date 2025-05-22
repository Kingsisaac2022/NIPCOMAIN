import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gauge, ArrowRight } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const DispenserManagementCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Dispenser Management</h3>
          <p className="text-text-secondary mt-1">Manage station dispensers and nozzles</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Gauge size={24} className="text-primary" />
        </div>
      </div>

      <Button
        onClick={() => navigate('/ceo/dispensers')}
        variant="primary"
        fullWidth
        icon={<ArrowRight size={20} />}
      >
        Manage Dispensers
      </Button>
    </Card>
  );
};

export default DispenserManagementCard;