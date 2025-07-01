
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, RotateCcw, Loader2 } from "lucide-react";

interface MessageInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  onReset: () => void;
  hasResults: boolean;
}

export const MessageInput = ({ onSubmit, isLoading, onReset, hasResults }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSubmit(message);
  };

  const handleReset = () => {
    setMessage("");
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
        어떤 메시지를 보내고 싶으세요?
      </h3>
      
      <div className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="예: 회의는 내일 오전 10시로 변경되었습니다. 확인 부탁드립니다."
          className="min-h-[100px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          disabled={isLoading}
        />
        
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                이모지 추천 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                이모지 추천받기
              </>
            )}
          </Button>
          
          {hasResults && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-4 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
