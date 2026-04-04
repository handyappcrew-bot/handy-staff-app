import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useNavToast } from "@/hooks/use-nav-toast";
import HomeHeader from "@/components/home/HomeHeader";
import NoticeCards from "@/components/home/NoticeCards";
import AttendanceCard, { type AttendanceStatus } from "@/components/home/AttendanceCard";
import ChecklistSection from "@/components/home/ChecklistSection";
import PromoBanner from "@/components/home/PromoBanner";
import StoreNotices from "@/components/home/StoreNotices";
import WeeklySchedule from "@/components/home/WeeklySchedule";
import SalaryPreview from "@/components/home/SalaryPreview";
import AttendanceMapDialog from "@/components/home/AttendanceMapDialog";
import BreakConfirmDialog from "@/components/home/BreakConfirmDialog";
import UnscheduledClockInDialog from "@/components/home/UnscheduledClockInDialog";
import SideMenu from "@/components/home/SideMenu";
import { useToast } from "@/hooks/use-toast";
import AccountSelector, { type AccountType } from "@/components/home/AccountSelector";
import { getStoreNotices, DUMMY_POSTS } from "@/lib/boardData";
import { getWeeklyHomeData } from "@/lib/scheduleData";

// ✨ 최적화된 구글 애드센스 광고 컴포넌트
const AdBanner = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="px-5 w-full">
      <div 
        className="overflow-hidden rounded-2xl bg-white/50 flex items-center justify-center"
        style={{ minHeight: '100px' }} // 💡 광고 로딩 전 영역이 사라지지 않게 최소 높이 지정
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", borderRadius: "16px" }}
          data-ad-client="ca-pub-2835570189350834"
          data-ad-slot="YOUR_AD_SLOT_ID" // 💡 실제 광고 단위 ID로 교체 필요
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        ></ins>
      </div>
    </div>
  );
};

const MOCK_ACCOUNTS: AccountType[] = [
  { id: "1", storeName: "메가커피 동작점", role: "직원" },
  { id: "2", storeName: "컴포즈커피 노량진역점", role: "사장님" },
  { id: "3", storeName: "빽다방 노량진역점", role: "직원" },
  { id: "4", storeName: "샤브올데이 노량진역점", role: "직원" },
];

const latestNotice = DUMMY_POSTS.filter(p => p.category === "공지사항")[0];
const MOCK_NOTICES = [
  { id: String(latestNotice?.id ?? 1), type: "board" as const, title: "게시판", description: latestNotice?.title ?? "새 공지가 있어요!", extraCount: 2 },
  { id: "pay-1", type: "salary" as const, title: "급여", description: `${new Date().getMonth() + 1}월 급여 명세서가 발급됐어요!`, extraCount: 2 },
];

const MOCK_CHECKLIST = [
  { id: "1", text: "오픈 전 시재 확인", checked: true },
  { id: "2", text: "발주 정리하고 13:40까지 발주 넣기", checked: true },
  { id: "3", text: "우유 날짜 보이게 정리하기", checked: false },
  { id: "4", text: "매장 청소 완료하기", checked: false },
];

const MOCK_STORE_NOTICES = getStoreNotices();

const getMonthData = () => {
  const now = new Date();
  const month = `${now.getMonth() + 1}월`;
  const firstDay = `${String(now.getMonth()+1).padStart(2,"0")}.01`;
  const today = `${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")}`;
  return {
    userName: "정수민",
    month,
    totalAmount: 180000,
    stores: [{ name: "메가커피 동작점", dateRange: `${firstDay}~${today}`, amount: 180000, hours: "17h 30m" }],
  };
};

const MOCK_WEEKLY = getWeeklyHomeData();
const MOCK_SALARY = getMonthData();

const formatDate = () => {
  const now = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${days[now.getDay()]})`;
};

const Index = () => {
  const { toast } = useToast();
  const { navigateTo } = useNavToast();
  const [activeTab, setActiveTab] = useState<"home" | "salary" | "attendance" | "board" | "myinfo">("home");
  const [notices, setNotices] = useState(MOCK_NOTICES);
  const [selectedAccount, setSelectedAccount] = useState<AccountType>(MOCK_ACCOUNTS[0]);
  const [accountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [mapDialogType, setMapDialogType] = useState<"clock_in" | "clock_out">("clock_in");
  const [breakDialogOpen, setBreakDialogOpen] = useState(false);
  const [breakDialogType, setBreakDialogType] = useState<"start" | "end">("start");
  const [unscheduledDialogOpen, setUnscheduledDialogOpen] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("before_work");
  const [clockInTime, setClockInTime] = useState<string | undefined>();
  const [breakStartTime, setBreakStartTime] = useState<string | undefined>();
  const [breakEndTime, setBreakEndTime] = useState<string | undefined>();
  const [wasLate, setWasLate] = useState(false);
  const [wasAbsent, setWasAbsent] = useState(false);
  
  const [testScheduleStart] = useState(() => {
    const n = new Date(Date.now() + 1 * 60 * 1000);
    return { hours: n.getHours(), minutes: n.getMinutes() };
  });
  const [testScheduleEnd] = useState(() => {
    const n = new Date(Date.now() + 3 * 60 * 1000);
    return { hours: n.getHours(), minutes: n.getMinutes() };
  });

  const getNowTime = () => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
  };

  const handleClockIn = useCallback(() => {
    setClockInTime(getNowTime());
    setAttendanceStatus("working");
    setMapDialogOpen(false);
    toast({ description: "출근을 완료 했어요. 오늘 근무도 파이팅!", duration: 2000 });
  }, [toast]);

  const handleClockOut = useCallback(() => {
    setAttendanceStatus("off_work");
    setMapDialogOpen(false);
    toast({ description: "퇴근을 완료 했어요. 오늘도 수고하셨어요!", duration: 2000 });
  }, [toast]);

  const handleBreakStart = useCallback(() => {
    setBreakStartTime(getNowTime());
    setAttendanceStatus("on_break");
    setBreakDialogOpen(false);
    toast({ description: "휴게 시간이 시작 되었어요", duration: 2000 });
  }, []);

  const handleBreakEnd = useCallback(() => {
    setBreakEndTime(getNowTime());
    setAttendanceStatus("break_done");
    setBreakDialogOpen(false);
    toast({ description: "휴게 시간이 종료 되었어요", duration: 2000 });
  }, []);

  const handleSubstituteClockIn = useCallback(() => {
    setUnscheduledDialogOpen(true);
  }, []);

  const openClockInDialog = useCallback(() => {
    setMapDialogType("clock_in");
    setMapDialogOpen(true);
  }, []);

  const openClockOutDialog = useCallback(() => {
    setMapDialogType("clock_out");
    setMapDialogOpen(true);
  }, []);

  const openBreakStartDialog = useCallback(() => {
    setBreakDialogType("start");
    setBreakDialogOpen(true);
  }, []);

  const openBreakEndDialog = useCallback(() => {
    setBreakDialogType("end");
    setBreakDialogOpen(true);
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleDismissNotice = useCallback((id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <>
    <div className="mx-auto max-w-lg min-h-screen" style={{ backgroundColor: '#F4F5F8' }}>
      <div ref={scrollContainerRef} className="pb-24" style={{ backgroundColor: '#F4F5F8' }}>
      
      <HomeHeader
        storeName={selectedAccount.storeName}
        roleLabel={selectedAccount.role}
        hasNotifications={true}
        onStoreClick={() => setAccountSelectorOpen(true)}
        onMenuClick={() => setSideMenuOpen(true)}
      />

      <NoticeCards notices={notices} onDismiss={handleDismissNotice} />

      <p className="px-5 py-3" style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: '#292B2E' }}>{formatDate()}</p>

      {(() => {
        const now = new Date();
        const schedStartSec = testScheduleStart.hours * 3600 + testScheduleStart.minutes * 60;
        const schedEndSec = testScheduleEnd.hours * 3600 + testScheduleEnd.minutes * 60;
        const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

        const schedStart = `${String(testScheduleStart.hours).padStart(2, "0")}:${String(testScheduleStart.minutes).padStart(2, "0")}`;
        const schedEnd = `${String(testScheduleEnd.hours).padStart(2, "0")}:${String(testScheduleEnd.minutes).padStart(2, "0")}`;

        const isCurrentlyLate = attendanceStatus === "before_work" && nowSec > schedStartSec && nowSec < schedEndSec;
        const isCurrentlyAbsent = attendanceStatus === "before_work" && nowSec >= schedEndSec;
        const isOvertime = (attendanceStatus === "working" || attendanceStatus === "break_done") && nowSec >= schedEndSec && !wasAbsent;
        const effectiveStatus = isCurrentlyAbsent
          ? "absent" as AttendanceStatus
          : isCurrentlyLate
            ? "late" as AttendanceStatus
            : isOvertime
              ? "overtime" as AttendanceStatus
              : attendanceStatus;

        return (
          <AttendanceCard
            status={effectiveStatus}
            scheduleStart={schedStart}
            scheduleEnd={schedEnd}
            clockInTime={clockInTime}
            breakStartTime={breakStartTime}
            breakEndTime={breakEndTime}
            wasLate={wasLate || isCurrentlyLate}
            wasAbsent={wasAbsent}
            onClockIn={() => {
              if (isCurrentlyAbsent) {
                setWasAbsent(true);
                setUnscheduledDialogOpen(true);
              } else {
                if (isCurrentlyLate) setWasLate(true);
                openClockInDialog();
              }
            }}
            onClockOut={openClockOutDialog}
            onBreakStart={openBreakStartDialog}
            onBreakEnd={openBreakEndDialog}
            onSubstituteClockIn={handleSubstituteClockIn}
          />
        );
      })()}

      <div className="mt-8">
        <ChecklistSection
          userName="정수민"
          items={MOCK_CHECKLIST}
          completedCount={2}
          totalCount={4}
        />
      </div>

      {/* ✨ 광고 배치 영역: 간격 mt-6으로 소폭 조정 */}
      <div className="mt-6">
        <AdBanner />
      </div>

      <div className="mt-8">
        <StoreNotices notices={MOCK_STORE_NOTICES} />
      </div>

      <div className="mt-8">
        <WeeklySchedule dateRange={MOCK_WEEKLY.dateRange} days={MOCK_WEEKLY.days} />
      </div>

      <div className="mt-8 mb-8">
        <SalaryPreview
          userName={MOCK_SALARY.userName}
          month={MOCK_SALARY.month}
          totalAmount={MOCK_SALARY.totalAmount}
          stores={MOCK_SALARY.stores}
        />
      </div>

      <div className="px-5 mb-8">
        <button onClick={() => navigateTo("/closing-report", "마감 보고서로 이동했어요")} className="pressable flex w-full items-center justify-between rounded-2xl bg-card p-5" style={{ boxShadow: '2px 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="text-left">
            <p className="text-xl font-bold text-foreground">마감보고</p>
            <p className="mt-1 text-sm text-muted-foreground">마감 직원은 오늘의 마감보고를 해주세요</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </button>
      </div>

      </div>
    </div>

      <AttendanceMapDialog
        open={mapDialogOpen}
        type={mapDialogType}
        onConfirm={mapDialogType === "clock_in" ? handleClockIn : handleClockOut}
        onCancel={() => setMapDialogOpen(false)}
      />
      <BreakConfirmDialog
        open={breakDialogOpen}
        type={breakDialogType}
        onConfirm={breakDialogType === "start" ? handleBreakStart : handleBreakEnd}
        onCancel={() => setBreakDialogOpen(false)}
      />
      <AccountSelector
        open={accountSelectorOpen}
        accounts={MOCK_ACCOUNTS}
        selectedId={selectedAccount.id}
        onSelect={(account) => {
          setSelectedAccount(account);
          setAccountSelectorOpen(false);
        }}
        onClose={() => setAccountSelectorOpen(false)}
      />
      <UnscheduledClockInDialog
        open={unscheduledDialogOpen}
        onConfirm={() => {
          setUnscheduledDialogOpen(false);
          openClockInDialog();
        }}
        onCancel={() => setUnscheduledDialogOpen(false)}
      />
      <SideMenu open={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
    </>
  );
};

export default Index;