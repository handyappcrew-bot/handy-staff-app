import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useRef } from "react";
import BottomNav from "@/components/home/BottomNav";
import ContractAlert from "@/components/home/ContractAlert";
import { NavToastProvider } from "@/hooks/use-nav-toast";
import Index from "./pages/Index.tsx";
import Notifications from "./pages/Notifications.tsx";
import NotificationScheduleChanged from "./pages/NotificationScheduleChanged.tsx";
import NotificationScheduleAdded from "./pages/NotificationScheduleAdded.tsx";
import Schedule from "./pages/Schedule.tsx";
import ScheduleChangeRequest from "./pages/ScheduleChangeRequest.tsx";
import VacationRequest from "./pages/VacationRequest.tsx";
import SalaryManagement from "./pages/SalaryManagement.tsx";
import PayStubDetail from "./pages/PayStubDetail.tsx";
import ClosingReport from "./pages/ClosingReport.tsx";
import AttendanceManagement from "./pages/AttendanceManagement.tsx";
import AttendanceRecordEdit from "./pages/AttendanceRecordEdit.tsx";
import NotFound from "./pages/NotFound.tsx";
import FAQ from "./pages/FAQ.tsx";
import Announcements from "./pages/Announcements.tsx";
import AnnouncementDetail from "./pages/AnnouncementDetail.tsx";
import Feedback from "./pages/Feedback.tsx";
import FeedbackDetail from "./pages/FeedbackDetail.tsx";
import Profile from "./pages/Profile.tsx";
import ProfileEdit from "./pages/ProfileEdit.tsx";
import PasswordChange from "./pages/PasswordChange.tsx";
import Login from "./pages/Login.tsx";
import Withdrawal from "./pages/Withdrawal.tsx";
import BoardList from "./pages/BoardList.tsx";
import BoardDetail from "./pages/BoardDetail.tsx";
import BoardWrite from "./pages/BoardWrite.tsx";

const queryClient = new QueryClient();

// BottomNav 표시 경로 - 2depth(탭 루트)만 표시, 3depth 이상 비노출
const BOTTOM_NAV_SHOW = ["/", "/salary", "/attendance", "/board", "/profile", "/schedule"];
const showBottomNav = (path: string) =>
  BOTTOM_NAV_SHOW.some((p) => path === p);

// 탭 전환 페이드 경로
const FADE_PATHS = ["/", "/salary", "/attendance", "/board", "/profile"];
const isFadePath = (path: string) => FADE_PATHS.some((p) => p === path);

// 바텀시트 페이지 페이드
const SHEET_PATHS = [
  "/schedule/change-request",
  "/schedule/vacation-request",
  "/attendance/record-edit",
  "/closing-report",
  "/board/write",
];
const isSheetPath = (path: string) => SHEET_PATHS.some((p) => path.startsWith(p));

const getActiveTab = (pathname: string): "home" | "salary" | "attendance" | "board" | "myinfo" => {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/salary")) return "salary";
  if (pathname.startsWith("/attendance")) return "attendance";
  if (pathname.startsWith("/board")) return "board";
  if (pathname.startsWith("/profile")) return "myinfo";
  if (pathname.startsWith("/schedule")) return "home";
  return "home";
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const GlobalBottomNav = () => {
  const { pathname } = useLocation();
  if (!showBottomNav(pathname)) return null;
  return <BottomNav activeTab={getActiveTab(pathname)} onTabChange={() => {}} />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const currentPath = location.pathname;
  const from = prevPath.current;

  useEffect(() => { prevPath.current = currentPath; });

  const getAnimClass = () => {
    if (isFadePath(currentPath) && isFadePath(from)) return "page-fade-enter";
    if (isSheetPath(currentPath)) return "page-fade-enter";
    return "page-enter";
  };

  return (
    <div key={location.key} className={getAnimClass()}>
      <Routes location={location}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/schedule-changed" element={<NotificationScheduleChanged />} />
        <Route path="/notifications/schedule-added" element={<NotificationScheduleAdded />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/schedule/change-request" element={<ScheduleChangeRequest />} />
        <Route path="/schedule/vacation-request" element={<VacationRequest />} />
        <Route path="/salary" element={<SalaryManagement />} />
        <Route path="/salary/pay-stub/:id" element={<PayStubDetail />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/attendance/record-edit" element={<AttendanceRecordEdit />} />
        <Route path="/closing-report" element={<ClosingReport />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/announcements/:id" element={<AnnouncementDetail />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/feedback/:id" element={<FeedbackDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/profile/edit/password" element={<PasswordChange />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/board" element={<BoardList />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const GlobalContractAlert = () => {
  const { pathname } = useLocation();
  if (pathname !== "/") return null;
  return <ContractAlert />;
};

const AppInner = () => (
  <NavToastProvider>
    <ScrollToTop />
    <AnimatedRoutes />
    <GlobalBottomNav />
    <GlobalContractAlert />
  </NavToastProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
