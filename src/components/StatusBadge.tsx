import { Clock, CheckCircle2 } from 'lucide-react';

export type Status = 'pending' | 'verified';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: 'Pending', icon: Clock, className: 'status-pending' },
  verified: { label: 'Verified', icon: CheckCircle2, className: 'status-verified' },
};

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${config.className} ${className}
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;
