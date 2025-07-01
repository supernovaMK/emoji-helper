
import { useState } from "react";
import { MessageInput } from "@/components/MessageInput";
import { MessageSuggestions } from "@/components/MessageSuggestions";
import { Header } from "@/components/Header";
import { RecipientSelector } from "@/components/RecipientSelector";
import { toast } from "sonner";

export type RecipientType = "boss" | "colleague" | "friend";
export type MessageVariant = {
  type: "formal" | "friendly" | "casual";
  label: string;
  message: string;
  description: string;
};

const Index = () => {
  const [originalMessage, setOriginalMessage] = useState("");
  const [recipientType, setRecipientType] = useState<RecipientType>("boss");
  const [suggestions, setSuggestions] = useState<MessageVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = (message: string, recipient: RecipientType): MessageVariant[] => {
    const baseMessage = message.trim();
    
    // 문맥 분석을 통한 이모지 추천 로직
    const isQuestion = baseMessage.includes("?") || baseMessage.includes("어떻게") || baseMessage.includes("언제");
    const isRequest = baseMessage.includes("부탁") || baseMessage.includes("요청") || baseMessage.includes("해주세요");
    const isUpdate = baseMessage.includes("변경") || baseMessage.includes("수정") || baseMessage.includes("알려드립니다");
    const isGratitude = baseMessage.includes("감사") || baseMessage.includes("고마워");
    const isApology = baseMessage.includes("죄송") || baseMessage.includes("미안");

    let suggestions: MessageVariant[] = [];

    if (recipient === "boss") {
      suggestions = [
        {
          type: "formal",
          label: "공손형",
          message: addEmojisToMessage(baseMessage, "formal", { isQuestion, isRequest, isUpdate, isGratitude, isApology }),
          description: "상사에게 정중하고 예의바른 톤"
        },
        {
          type: "friendly",
          label: "친근형", 
          message: addEmojisToMessage(baseMessage, "friendly", { isQuestion, isRequest, isUpdate, isGratitude, isApology }),
          description: "따뜻하면서도 예의를 갖춘 톤"
        }
      ];
    } else if (recipient === "colleague") {
      suggestions = [
        {
          type: "friendly",
          label: "친근형",
          message: addEmojisToMessage(baseMessage, "friendly", { isQuestion, isRequest, isUpdate, isGratitude, isApology }),
          description: "동료에게 친근하고 협조적인 톤"
        },
        {
          type: "casual",
          label: "캐주얼형",
          message: addEmojisToMessage(baseMessage, "casual", { isQuestion, isRequest, isUpdate, isGratitude, isApology }),
          description: "편안하고 자연스러운 톤"
        }
      ];
    } else {
      suggestions = [
        {
          type: "friendly",
          label: "친근형",
          message: addEmojisToMessage(baseMessage, "friendly", { isQuestion, isRequest, isUpdate, isGratitude, isApology }),
          description: "따뜻하고 다정한 톤"
        },
        {
          type: "casual",
          label: "캐주얼형", 
          message: addEmojisToMessage(baseMessage, "casual", { isQuestion, isRequest, isUpdate, isGratitude, isApology }),
          description: "편안하고 재미있는 톤"
        }
      ];
    }

    return suggestions;
  };

  const addEmojisToMessage = (
    message: string, 
    tone: "formal" | "friendly" | "casual",
    context: { isQuestion: boolean; isRequest: boolean; isUpdate: boolean; isGratitude: boolean; isApology: boolean; }
  ): string => {
    let result = message;
    
    // 문맥별 이모지 매핑
    if (context.isGratitude) {
      if (tone === "formal") result += " 🙏";
      else if (tone === "friendly") result += " 😊🙏";
      else result += " 😄🙏✨";
    } else if (context.isApology) {
      if (tone === "formal") result += " 🙏";
      else if (tone === "friendly") result += " 😅🙏";
      else result += " 😅💦";
    } else if (context.isRequest) {
      if (tone === "formal") result += " 🙏";
      else if (tone === "friendly") result += " 😊";
      else result += " 😊👍";
    } else if (context.isUpdate) {
      if (tone === "formal") result = result.replace(/\b(\d{1,2}시)\b/g, "$1 🕙");
      else if (tone === "friendly") result = result.replace(/\b(\d{1,2}시)\b/g, "$1 🕙") + " 😊";
      else result = result.replace(/\b(\d{1,2}시)\b/g, "$1 🕙") + " 😄";
    } else if (context.isQuestion) {
      if (tone === "formal") result += " 🤔";
      else if (tone === "friendly") result += " 😊";
      else result += " 🤔💭";
    } else {
      // 일반적인 경우
      if (tone === "formal" && !result.includes("🙏")) result += " 😊";
      else if (tone === "friendly") result += " 😊";
      else if (tone === "casual") result += " 😄";
    }

    return result;
  };

  const handleSubmit = async (message: string) => {
    if (!message.trim()) {
      toast.error("메시지를 입력해주세요");
      return;
    }

    setIsLoading(true);
    setOriginalMessage(message);
    
    // 실제로는 2초 미만으로 빠르게 처리
    setTimeout(() => {
      const newSuggestions = generateSuggestions(message, recipientType);
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 800);
  };

  const handleCopy = async (message: string, label: string) => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success(`${label} 메시지가 복사되었습니다! 📋`);
    } catch (error) {
      toast.error("복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleReset = () => {
    setOriginalMessage("");
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <Header />
        
        <div className="space-y-6">
          <RecipientSelector 
            value={recipientType} 
            onChange={setRecipientType} 
          />
          
          <MessageInput 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onReset={handleReset}
            hasResults={suggestions.length > 0}
          />
          
          {suggestions.length > 0 && (
            <MessageSuggestions 
              originalMessage={originalMessage}
              suggestions={suggestions}
              onCopy={handleCopy}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
