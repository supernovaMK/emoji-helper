
import { RecipientType } from "@/pages/Index";

interface RecipientSelectorProps {
  value: RecipientType;
  onChange: (value: RecipientType) => void;
}

export const RecipientSelector = ({ value, onChange }: RecipientSelectorProps) => {
  const options = [
    { value: "boss" as const, label: "상사", emoji: "👔", description: "팀장, 부장님 등" },
    { value: "colleague" as const, label: "동료", emoji: "🤝", description: "같은 팀, 타부서 등" },
    { value: "friend" as const, label: "친구", emoji: "😊", description: "친한 동기, 지인 등" }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        누구에게 보낼 메시지인가요?
      </h3>
      
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              p-3 rounded-xl text-center transition-all duration-200 border-2
              ${value === option.value 
                ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-300 shadow-sm' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }
            `}
          >
            <div className="text-xl mb-1">{option.emoji}</div>
            <div className={`text-sm font-medium ${value === option.value ? 'text-blue-700' : 'text-gray-700'}`}>
              {option.label}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
