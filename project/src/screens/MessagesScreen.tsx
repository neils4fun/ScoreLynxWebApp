import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { sendMessageToGameWithSender, getMessagesForGame } from '../api/messageApi';
import { useGame } from '../context/GameContext';

interface MessagesScreenProps {
  onBack: () => void;
}

const SENDER_STORAGE_KEY = 'scorelynx_message_sender';

export default function MessagesScreen({ onBack }: MessagesScreenProps) {
  const { selectedGame } = useGame();
  const [sender, setSender] = useState(() => {
    return localStorage.getItem(SENDER_STORAGE_KEY) || '';
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    messageID: string;
    text: string;
    sender: string;
    created: string;
  }>>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    if (!selectedGame?.gameID) {
      alert('Please select a Game using the Games tab before sending a message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await sendMessageToGameWithSender({
        gameID: selectedGame.gameID,
        message: message.trim(),
        ...(sender.trim() ? { sender: sender.trim() } : {})
      });

      // Clear message but keep sender
      setMessage('');
      
      // Refresh messages after sending
      handleShowMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowMessages = async () => {
    if (!selectedGame?.gameID) {
      alert('Please select a Game using the Games tab to view messages.');
      return;
    }

    setIsLoadingMessages(true);
    setError(null);

    try {
      const response = await getMessagesForGame(selectedGame.gameID);
      setMessages(response.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Update localStorage when sender changes
  useEffect(() => {
    if (sender.trim()) {
      localStorage.setItem(SENDER_STORAGE_KEY, sender.trim());
    }
  }, [sender]);

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {selectedGame && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md">
              Sending message to game: {selectedGame.gameKey} ({selectedGame.round}) {selectedGame.gameType} game
            </div>
          )}

          {/* Sender Field */}
          <div>
            <label htmlFor="sender" className="block text-sm font-medium text-gray-700 mb-1">
              Sender:
            </label>
            <input
              type="text"
              id="sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message:
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                message.trim() && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
            <button
              onClick={handleShowMessages}
              disabled={isSubmitting || isLoadingMessages}
              className="flex-1 py-2 px-4 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoadingMessages ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Show Messages</span>
              )}
            </button>
          </div>

          {/* Messages List */}
          {messages.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Message History</h2>
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                {messages.map((msg) => (
                  <div
                    key={msg.messageID}
                    className="p-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        {msg.sender || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(msg.created + 'Z').toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 