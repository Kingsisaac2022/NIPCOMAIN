import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  UserCog, 
  Building2, 
  Gauge, 
  Database, 
  Users, 
  Truck, 
  DollarSign, 
  Bell,
  ChevronLeft
} from 'lucide-react';
import Card from '../components/Card';

const GuidelinesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card-bg border-b border-white/5">
        <div className="page-container py-12">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300 mb-8"
          >
            <ChevronLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-background" />
            </div>
            <h1 className="page-title">Platform Guidelines</h1>
          </div>
          <p className="text-text-secondary text-lg">
            A comprehensive guide to using the NIPCO Smart Station Manager
          </p>
        </div>
      </div>

      <main className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CEO Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserCog size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">CEO Guidelines</h2>
            </div>

            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-primary" />
                Station Management
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li>• View and manage all NIPCO stations from a central dashboard</li>
                <li>• Monitor station status, manager details, and key metrics</li>
                <li>• Update station information and manager credentials</li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Database size={20} className="text-primary" />
                Tank Operations
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li>• Create and manage tanks for each station</li>
                <li>• Monitor fuel levels and tank capacity</li>
                <li>• Update fuel prices and track price history</li>
                <li>• View tank offload logs and volume updates</li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Gauge size={20} className="text-primary" />
                Dispenser Control
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li>• Set up and manage fuel dispensers</li>
                <li>• Configure nozzles and track readings</li>
                <li>• Monitor dispenser activity and sales</li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users size={20} className="text-primary" />
                Staff Management
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li>• Add and manage station staff</li>
                <li>• Assign roles and responsibilities</li>
                <li>• Track staff attendance and performance</li>
              </ul>
            </Card>
          </div>

          {/* Station Manager Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Station Manager Guidelines</h2>
            </div>

            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Truck size={20} className="text-primary" />
                Offload Management
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li>• Record driver offloads with volume verification</li>
                <li>• Update tank volumes after offloading</li>
                <li>• Track offload history and reconciliation</li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-primary" />
                Sales & Revenue
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li>• Monitor daily sales and revenue</li>
                <li>• Track dispenser readings and volume sold</li>
                <li>• Generate sales reports and analytics</li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bell size={20} className="text-primary" />
                Notifications & Alerts
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li>• Receive real-time alerts for important events</li>
                <li>• Track purchase orders and delivery status</li>
                <li>• Monitor system notifications and updates</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuidelinesPage;