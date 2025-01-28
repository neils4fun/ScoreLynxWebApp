import { Lock } from 'lucide-react';
import type { GolfGroup } from '../../types/game';

interface GroupCardProps {
  group: GolfGroup;
  isSelected?: boolean;
  onClick?: () => void;
}

export function GroupCard({ group, isSelected, onClick }: GroupCardProps) {
  return (
    <div
      onClick={onClick}
      className={`py-2 px-4 cursor-pointer ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-900">
          {group.groupName}
        </div>
        {group.password && (
          <Lock className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}