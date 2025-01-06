import { GolfGroup } from '../types/api';
import { Lock } from 'lucide-react';

interface GroupCardProps {
  group: GolfGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{group.groupName}</h3>
        {group.password && (
          <Lock className="w-4 h-4 text-gray-400" aria-label="Password protected" />
        )}
      </div>
    </div>
  );
}