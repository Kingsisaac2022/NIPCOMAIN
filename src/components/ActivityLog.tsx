import React from 'react';
import { History, AlertCircle } from 'lucide-react';
import Card from './Card';

interface Activity {
  id: number;
  type: 'tank' | 'staff' | 'dispenser' | 'sales' | 'price';
  message: string;
  timestamp: string;
}

interface ActivityLogProps {
  activities: Activity[];
  title?: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities, title = "Recent Activity" }) => {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <History size={20} className="text-primary" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{activity.message}</span>
                <span className="text-sm text-text-secondary">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
              <span className={`
                inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium
                ${activity.type === 'tank' ? 'bg-primary/10 text-primary' :
                  activity.type === 'staff' ? 'bg-success/10 text-success' :
                  activity.type === 'dispenser' ? 'bg-warning/10 text-warning' :
                  activity.type === 'sales' ? 'bg-info/10 text-info' :
                  'bg-error/10 text-error'}
              `}>
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8 text-text-secondary">
            <AlertCircle size={20} className="mr-2" />
            <span>No recent activity</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityLog;