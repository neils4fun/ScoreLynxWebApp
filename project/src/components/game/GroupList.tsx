import { GroupCard } from './GroupCard';
import type { GolfGroup } from '../../types/game';

interface GroupListProps {
  groups: GolfGroup[];
  onGroupSelect: (group: GolfGroup) => void;
  selectedGroupId?: string;
}

export function GroupList({ groups, onGroupSelect, selectedGroupId }: GroupListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="divide-y divide-gray-200">
        {groups.map((group) => (
          <GroupCard
            key={group.groupID}
            group={group}
            isSelected={group.groupID === selectedGroupId}
            onClick={() => onGroupSelect(group)}
          />
        ))}
      </div>
    </div>
  );
}