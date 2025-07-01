
import { MessageCircle, Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <Sparkles className="w-5 h-5 text-pink-500" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        이모지 도우미
      </h1>
      
      <p className="text-gray-600 text-sm leading-relaxed">
        세린님의 메시지에 딱 맞는 이모지를<br />
        자동으로 추천해드릴게요! ✨
      </p>
    </header>
  );
};
