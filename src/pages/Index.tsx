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
  correctedText?: string;
  grammarIssues?: string[];
  toneChanged?: boolean;
  originalTone?: string;
};

const Index = () => {
  const [originalMessage, setOriginalMessage] = useState("");
  const [recipientType, setRecipientType] = useState<RecipientType>("boss");
  const [suggestions, setSuggestions] = useState<MessageVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkGrammarAndSpelling = (text: string) => {
    const issues: string[] = [];
    let correctedText = text;
    let hasChanges = false;

    // 확장된 맞춤법 검사
    const corrections = [
      { wrong: "안녕하세요", correct: "안녕하세요" },
      { wrong: "감사합니다", correct: "감사합니다" },
      { wrong: "죄송합니다", correct: "죄송합니다" },
      { wrong: "확인해주세요", correct: "확인해 주세요" },
      { wrong: "부탁드립니다", correct: "부탁드립니다" },
      { wrong: "되겠습니다", correct: "되겠습니다" },
      { wrong: "알겠습니다", correct: "알겠습니다" },
      { wrong: "해주세요", correct: "해 주세요" },
      { wrong: "드릴게요", correct: "드릴게요" },
      { wrong: "될수있습니다", correct: "될 수 있습니다" },
      { wrong: "할수있습니다", correct: "할 수 있습니다" },
      { wrong: "갈수있습니다", correct: "갈 수 있습니다" },
      { wrong: "올수있습니다", correct: "올 수 있습니다" },
      { wrong: "해드릴게요", correct: "해드릴게요" },
      { wrong: "그럼안녕", correct: "그럼 안녕" },
      { wrong: "잘부탁드립니다", correct: "잘 부탁드립니다" },
    ];

    // 띄어쓰기 검사 패턴 확장
    const spacingPatterns = [
      { pattern: /(\w+)(할수|될수|갈수|올수)(\s*)(\w+)/g, replacement: "$1할 수 $4", issue: "띄어쓰기 수정" },
      { pattern: /(\w+)(해주|드려|봐주|와주|가주)(\s*)(\w+)/g, replacement: "$1해 주 $4", issue: "띄어쓰기 수정" },
      { pattern: /잘(\s*)부탁/g, replacement: "잘 부탁", issue: "띄어쓰기 수정" },
      { pattern: /그럼(\s*)안녕/g, replacement: "그럼 안녕", issue: "띄어쓰기 수정" },
    ];

    // 맞춤법 교정 적용
    corrections.forEach(({ wrong, correct }) => {
      if (text.includes(wrong) && wrong !== correct) {
        correctedText = correctedText.replace(new RegExp(wrong, 'g'), correct);
        issues.push(`'${wrong}' → '${correct}'`);
        hasChanges = true;
      }
    });

    // 띄어쓰기 검사 적용
    spacingPatterns.forEach(({ pattern, replacement, issue }) => {
      if (pattern.test(correctedText)) {
        correctedText = correctedText.replace(pattern, replacement);
        if (!issues.includes(issue)) {
          issues.push(issue);
          hasChanges = true;
        }
      }
    });

    // 문장 부호 검사
    if (!text.match(/[.!?]$/)) {
      issues.push("문장 끝에 마침표나 느낌표 추가 권장");
    }

    return { correctedText: hasChanges ? correctedText : text, issues: hasChanges ? issues : [] };
  };

  const adjustToneForRecipient = (message: string, targetTone: "formal" | "friendly" | "casual", recipientType: RecipientType) => {
    let adjustedMessage = message;
    let toneChanged = false;
    let originalTone = "neutral";

    // 원본 메시지의 톤 분석
    if (message.includes("습니다") || message.includes("드립니다")) {
      originalTone = "formal";
    } else if (message.includes("요") || message.includes("해요")) {
      originalTone = "friendly";
    } else if (message.includes("야") || message.includes("어") || message.includes("지")) {
      originalTone = "casual";
    }

    // 톤 변경이 필요한 경우에만 적용
    if (originalTone !== targetTone) {
      if (targetTone === "formal" && recipientType === "boss") {
        // 공손형으로 변경
        adjustedMessage = adjustedMessage
          .replace(/해요$/g, "합니다")
          .replace(/이에요$/g, "입니다")
          .replace(/거예요$/g, "것입니다")
          .replace(/될 거예요$/g, "될 것입니다")
          .replace(/할게요$/g, "하겠습니다")
          .replace(/부탁해요$/g, "부탁드립니다");
        
        if (adjustedMessage !== message) {
          toneChanged = true;
        }
      } else if (targetTone === "friendly") {
        // 친근형으로 변경
        adjustedMessage = adjustedMessage
          .replace(/습니다$/g, "요")
          .replace(/입니다$/g, "이에요")
          .replace(/것입니다$/g, "거예요")
          .replace(/하겠습니다$/g, "할게요")
          .replace(/부탁드립니다$/g, "부탁해요");
        
        if (adjustedMessage !== message) {
          toneChanged = true;
        }
      } else if (targetTone === "casual" && recipientType === "friend") {
        // 캐주얼형으로 변경
        adjustedMessage = adjustedMessage
          .replace(/습니다$/g, "어")
          .replace(/해요$/g, "해")
          .replace(/이에요$/g, "야")
          .replace(/거예요$/g, "거야")
          .replace(/부탁해요$/g, "부탁해")
          .replace(/할게요$/g, "할게");
        
        if (adjustedMessage !== message) {
          toneChanged = true;
        }
      }
    }

    return { adjustedMessage, toneChanged, originalTone };
  };

  const addEmojisToMessage = (
    message: string, 
    tone: "formal" | "friendly" | "casual",
    context: { isQuestion: boolean; isRequest: boolean; isUpdate: boolean; isGratitude: boolean; isApology: boolean; }
  ): string => {
    let result = message;
    
    // 시간 표현에 이모지 추가 (중간 삽입)
    result = result.replace(/\b(\d{1,2})시\b/g, "$1시 🕙");
    result = result.replace(/\b오전\b/g, "오전 ☀️");
    result = result.replace(/\b오후\b/g, "오후 🌅");
    
    // 요일 표현에 이모지 추가
    result = result.replace(/\b월요일\b/g, "월요일 📅");
    result = result.replace(/\b화요일\b/g, "화요일 📅");
    result = result.replace(/\b수요일\b/g, "수요일 📅");
    result = result.replace(/\b목요일\b/g, "목요일 📅");
    result = result.replace(/\b금요일\b/g, "금요일 📅");
    result = result.replace(/\b토요일\b/g, "토요일 🎉");
    result = result.replace(/\b일요일\b/g, "일요일 🌟");
    
    // 감정 표현에 이모지 추가 (중간 삽입)
    if (tone === "casual") {
      result = result.replace(/\b좋아\b/g, "좋아 👍");
      result = result.replace(/\b최고\b/g, "최고 🎉");
      result = result.replace(/\b완료\b/g, "완료 ✅");
      result = result.replace(/\b성공\b/g, "성공 🎯");
    } else if (tone === "friendly") {
      result = result.replace(/\b완료\b/g, "완료 ✅");
      result = result.replace(/\b확인\b/g, "확인 👀");
    }
    
    // 문맥별 끝 이모지 추가
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
      if (tone === "formal") result += " 📋";
      else if (tone === "friendly") result += " 😊";
      else result += " 😄";
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

  const generateSuggestions = (message: string, recipient: RecipientType): MessageVariant[] => {
    const baseMessage = message.trim();
    const { correctedText, issues } = checkGrammarAndSpelling(baseMessage);
    
    // 문맥 분석을 통한 이모지 추천 로직
    const isQuestion = baseMessage.includes("?") || baseMessage.includes("어떻게") || baseMessage.includes("언제");
    const isRequest = baseMessage.includes("부탁") || baseMessage.includes("요청") || baseMessage.includes("해주세요");
    const isUpdate = baseMessage.includes("변경") || baseMessage.includes("수정") || baseMessage.includes("알려드립니다");
    const isGratitude = baseMessage.includes("감사") || baseMessage.includes("고마워");
    const isApology = baseMessage.includes("죄송") || baseMessage.includes("미안");

    let suggestions: MessageVariant[] = [];
    const textToUse = issues.length > 0 ? correctedText : baseMessage;

    if (recipient === "boss") {
      // 공손형
      const formalTone = adjustToneForRecipient(textToUse, "formal", recipient);
      const formalMessage = addEmojisToMessage(formalTone.adjustedMessage, "formal", { isQuestion, isRequest, isUpdate, isGratitude, isApology });
      
      suggestions.push({
        type: "formal",
        label: "공손형",
        message: formalMessage,
        description: "상사에게 정중하고 예의바른 톤",
        correctedText: issues.length > 0 ? correctedText : undefined,
        grammarIssues: issues.length > 0 ? issues : undefined,
        toneChanged: formalTone.toneChanged,
        originalTone: formalTone.originalTone
      });

      // 친근형
      const friendlyTone = adjustToneForRecipient(textToUse, "friendly", recipient);
      const friendlyMessage = addEmojisToMessage(friendlyTone.adjustedMessage, "friendly", { isQuestion, isRequest, isUpdate, isGratitude, isApology });
      
      suggestions.push({
        type: "friendly",
        label: "친근형", 
        message: friendlyMessage,
        description: "따뜻하면서도 예의를 갖춘 톤",
        correctedText: issues.length > 0 ? correctedText : undefined,
        grammarIssues: issues.length > 0 ? issues : undefined,
        toneChanged: friendlyTone.toneChanged,
        originalTone: friendlyTone.originalTone
      });
    } else if (recipient === "colleague") {
      // 친근형
      const friendlyTone = adjustToneForRecipient(textToUse, "friendly", recipient);
      const friendlyMessage = addEmojisToMessage(friendlyTone.adjustedMessage, "friendly", { isQuestion, isRequest, isUpdate, isGratitude, isApology });
      
      suggestions.push({
        type: "friendly",
        label: "친근형",
        message: friendlyMessage,
        description: "동료에게 친근하고 협조적인 톤",
        correctedText: issues.length > 0 ? correctedText : undefined,
        grammarIssues: issues.length > 0 ? issues : undefined,
        toneChanged: friendlyTone.toneChanged,
        originalTone: friendlyTone.originalTone
      });

      // 캐주얼형
      const casualTone = adjustToneForRecipient(textToUse, "casual", recipient);
      const casualMessage = addEmojisToMessage(casualTone.adjustedMessage, "casual", { isQuestion, isRequest, isUpdate, isGratitude, isApology });
      
      suggestions.push({
        type: "casual",
        label: "캐주얼형",
        message: casualMessage,
        description: "편안하고 자연스러운 톤",
        correctedText: issues.length > 0 ? correctedText : undefined,
        grammarIssues: issues.length > 0 ? issues : undefined,
        toneChanged: casualTone.toneChanged,
        originalTone: casualTone.originalTone
      });
    } else {
      // 친근형
      const friendlyTone = adjustToneForRecipient(textToUse, "friendly", recipient);
      const friendlyMessage = addEmojisToMessage(friendlyTone.adjustedMessage, "friendly", { isQuestion, isRequest, isUpdate, isGratitude, isApology });
      
      suggestions.push({
        type: "friendly",
        label: "친근형",
        message: friendlyMessage,
        description: "따뜻하고 다정한 톤",
        correctedText: issues.length > 0 ? correctedText : undefined,
        grammarIssues: issues.length > 0 ? issues : undefined,
        toneChanged: friendlyTone.toneChanged,
        originalTone: friendlyTone.originalTone
      });

      // 캐주얼형
      const casualTone = adjustToneForRecipient(textToUse, "casual", recipient);
      const casualMessage = addEmojisToMessage(casualTone.adjustedMessage, "casual", { isQuestion, isRequest, isUpdate, isGratitude, isApology });
      
      suggestions.push({
        type: "casual",
        label: "캐주얼형", 
        message: casualMessage,
        description: "편안하고 재미있는 톤",
        correctedText: issues.length > 0 ? correctedText : undefined,
        grammarIssues: issues.length > 0 ? issues : undefined,
        toneChanged: casualTone.toneChanged,
        originalTone: casualTone.originalTone
      });
    }

    return suggestions;
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
