import { ArrowLeft } from 'lucide-react';

interface InformationScreenProps {
  onBack: () => void;
  onNavigateToGameInformation: () => void;
  onNavigateToSkinsInformation: () => void;
  onNavigateToJunkInformation: () => void;
}

export default function InformationScreen({ 
  onBack,
  onNavigateToGameInformation,
  onNavigateToSkinsInformation,
  onNavigateToJunkInformation
}: InformationScreenProps) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold ml-4">Information</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <button
          onClick={onNavigateToGameInformation}
          className="w-full flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50"
        >
          <div className="flex items-center">
            <span className="text-gray-900">Game Information</span>
          </div>
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <button
          onClick={onNavigateToSkinsInformation}
          className="w-full flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50"
        >
          <div className="flex items-center">
            <span className="text-gray-900">Skins Information</span>
          </div>
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <button
          onClick={onNavigateToJunkInformation}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center">
            <span className="text-gray-900">Junk Information</span>
          </div>
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
