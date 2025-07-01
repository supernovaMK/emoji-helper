
import { MessageVariant } from "@/pages/Index";
import { Copy, Check, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface MessageSuggestionsProps {
  originalMessage: string;
  suggestions: MessageVariant[];
  onCopy: (message: string, label: string) => void;
}

export const MessageSuggestions = ({ originalMessage, suggestions, onCopy }: MessageSuggestionsProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (message: string, label: string, index: number) => {
    await onCopy(message, label);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getToneColor = (type: string) => {
    switch (type) {
      case "formal": return "bg-blue-50 border-blue-200 text-blue-700";
      case "friendly": return "bg-green-50 border-green-200 text-green-700";
      case "casual": return "bg-orange-50 border-orange-200 text-orange-700";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getToneIcon = (type: string) => {
    switch (type) {
      case "formal": return "👔";
      case "friendly": return "😊";
      case "casual": return "😄";
      default: return "💬";
    }
  };

  const hasGrammarIssues = suggestions.some(s => s.grammarIssues && s.grammarIssues.length > 0);
  const hasToneChanges = suggestions.some(s => s.toneChanged);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-pink-100 rounded-full">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">이모지 추천 완료!</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">원본 메시지</h3>
        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg mb-4">
          {originalMessage}
        </p>

        {hasGrammarIssues && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-1">맞춤법이 수정되었습니다</h4>
                {suggestions[0].grammarIssues && suggestions[0].grammarIssues.map((issue, index) => (
                  <p key={index} className="text-xs text-amber-700 mb-1">• {issue}</p>
                ))}
                {suggestions[0].correctedText && (
                  <p className="text-xs text-amber-700 mt-2">
                    <span className="font-medium">수정된 문장:</span> {suggestions[0].correctedText}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {hasToneChanges && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-purple-800 mb-1">메시지 톤이 조정되었습니다</h4>
                <p className="text-xs text-purple-700">
                  각 추천 버전에 맞게 문체와 어미가 자연스럽게 변경되었습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          추천 메시지 (클릭하여 복사)
        </h3>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="group relative border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all duration-200 cursor-pointer"
              onClick={() => handleCopy(suggestion.message, suggestion.label, index)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-lg">{getToneIcon(suggestion.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getToneColor(suggestion.type)}`}>
                      {suggestion.label}
                    </span>
                    {suggestion.grammarIssues && suggestion.grammarIssues.length > 0 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 border border-amber-300 text-amber-700">
                        맞춤법 수정됨
                      </span>
                    )}
                    {suggestion.toneChanged && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 border border-purple-300 text-purple-700">
                        톤 조정됨
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-800 font-medium mb-1 leading-relaxed">
                    {suggestion.message}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    {suggestion.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            💡 팁: 메시지를 클릭하면 자동으로 복사됩니다!
          </p>
        </div>
      </div>
    </div>
  );
};
