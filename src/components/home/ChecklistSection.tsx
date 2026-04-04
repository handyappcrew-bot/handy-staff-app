import { useState } from "react";
import { Check } from "lucide-react";

interface CheckItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistSectionProps {
  userName: string;
  items: CheckItem[];
  completedCount: number;
  totalCount: number;
}

const ChecklistSection = ({ userName, items: initialItems }: ChecklistSectionProps) => {
  const [items, setItems] = useState(initialItems);

  const completedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <div className="px-5">
      <p style={{ fontSize: 'clamp(17px, 4.5vw, 22px)', fontWeight: 700, letterSpacing: '-0.01em', color: '#1E1E1E' }}>오늘 할 일</p>
      <p className="mb-4" style={{ fontSize: 'clamp(17px, 4.5vw, 22px)', fontWeight: 700, letterSpacing: '-0.01em', color: '#1E1E1E' }}>
        <span style={{ color: '#4261FF' }}>체크리스트</span>를 확인해주세요
      </p>

      <div className="rounded-2xl bg-card p-4" style={{ boxShadow: '2px 2px 12px rgba(0,0,0,0.06)' }}>
        <p className="mb-3 flex items-center" style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em', color: '#444444' }}>
          {userName} 님의 체크리스트
          <span style={{ marginLeft: '7px', fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em', color: '#70737B' }}>
            (<span style={{ color: '#10C97D' }}>{completedCount}</span>/{totalCount})
          </span>
        </p>
        <div className="mb-3 h-px w-full bg-[hsl(var(--checklist-divider))]" />

        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`pressable flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${item.checked
                ? "border-[hsl(var(--status-green))] bg-[hsl(var(--status-green-light))]"
                : "border-transparent bg-muted"
                }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.checked
                  ? "bg-[hsl(var(--status-green))]"
                  : "border border-muted-foreground/30 bg-card"
                  }`}
              >
                <Check className={`h-3.5 w-3.5 ${item.checked ? "text-white" : "text-muted-foreground/30"}`} />
              </div>
              <span
                className={`text-sm font-medium ${item.checked ? "text-[hsl(var(--status-green))]" : "text-muted-foreground"
                  }`}
              >
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChecklistSection;
