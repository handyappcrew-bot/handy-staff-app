import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavToast } from "@/hooks/use-nav-toast";

// 추가된 일정 날짜 (2025.10.24 목 → key: 2025-10-24)
const ADDED_DATE = { year: 2025, month: 9, date: 24, key: "2025-10-24" };

const NotificationScheduleAdded = () => {
  const navigate = useNavigate();
  const { navigateTo } = useNavToast();

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-card">
      <div className="pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 px-2 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="pressable p-1 flex-shrink-0">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <h1 style={{fontSize:'20px',fontWeight:700,letterSpacing:'-0.02em',color:'#19191B'}}>알림 상세</h1>
      </div>
      <div className="border-b border-border" />

      {/* Content */}
      <div className="flex-1 px-5 pt-4">
        <h2 className="text-[24px] font-bold text-foreground leading-tight">
          새로운 일정이 추가되었어요
        </h2>
        <p className="text-[24px] font-bold text-foreground leading-tight mt-1">
          내용을 확인해 주세요
        </p>

        {/* 추가된 일정 */}
        <p className="mt-8 text-[14px] font-medium text-[#4261FF]">*추가된 일정</p>
        <div className="mt-2 rounded-2xl bg-[#F5F6F8] px-5 py-4 flex items-center gap-3">
          <span className="rounded-md bg-[#FFF8E1] px-2.5 py-0.5 text-[14px] font-medium text-[#F9A825]">
            오픈
          </span>
          <span className="text-[15px] font-medium text-foreground">2025.10.24 (목)</span>
          <span className="text-[14px] text-[#93989E]">08:00 - 13:00</span>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-5 pb-8 pt-4">
        <button
          onClick={() => navigateTo("/schedule", "일정 확인으로 이동했어요", { showLoading: true, forceAll: true, state: { highlightDate: ADDED_DATE } })}
          className="pressable w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground"
        >
          일정 확인하기
        </button>
      </div>
      </div>
    </div>
  );
};

export default NotificationScheduleAdded;
