import { ArrowLeft } from 'lucide-react';

interface SettingsScreenProps {
  onNavigateToCourseMaintenance: () => void;
  onNavigateToMessages: () => void;
}

export default function SettingsScreen({ 
  onNavigateToCourseMaintenance,
  onNavigateToMessages
}: SettingsScreenProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white rounded-lg shadow">
        <button
          onClick={onNavigateToCourseMaintenance}
          className="w-full flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50"
        >
          <div className="flex items-center">
            <span className="text-gray-900">Course Maintenance</span>
          </div>
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <button
          onClick={onNavigateToMessages}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center">
            <span className="text-gray-900">Manage Messages</span>
          </div>
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
} 