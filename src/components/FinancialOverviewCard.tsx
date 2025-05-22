import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowRight, TrendingUp } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const FinancialOverviewCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Financial Overview</h3>
          <p className="text-text-secondary mt-1">Track revenue and expenses</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <TrendingUp size={24} className="text-primary" />
        </div>
      </div>

      <Button
        onClick={() => navigate('/ceo/finance')}
        variant="primary"
        fullWidth
        icon={<ArrowRight size={20} />}
      >
        View Financials
      </Button>
    </Card>
  );
};

export default FinancialOverviewCard;