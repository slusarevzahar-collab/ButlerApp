import { Task } from '../App';
import { Card } from './ui/card';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PlayCircle 
} from 'lucide-react';

interface StatsOverviewProps {
  tasks: Task[];
}

export function StatsOverview({ tasks }: StatsOverviewProps) {
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
  };

  const statCards = [
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: PlayCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Urgent',
      value: stats.urgent,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
