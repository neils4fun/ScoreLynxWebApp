import { GolfGroup } from '../types/api';
import { Lock } from 'lucide-react';

interface GroupListProps {
  groups: GolfGroup[];
  onGroupSelect: (group: GolfGroup) => void;
}

export function GroupList({ groups, onGroupSelect }: GroupListProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-0.5 border border-gray-200 rounded-lg overflow-hidden">
      {groups.map((group) => (
        <li 
          key={group.groupID}
          onClick={() => onGroupSelect(group)}
          className="px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between border-b last:border-b-0 border-gray-200 cursor-pointer text-sm"
        >
          <span className="text-gray-900">{group.groupName}</span>
          {group.password && (
            <Lock className="w-3.5 h-3.5 text-gray-400" aria-label="Password protected" />
          )}
        </li>
      ))}
    </ul>
  );
}