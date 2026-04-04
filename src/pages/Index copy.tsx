import { useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";
import NotificationBanners from "@/components/home/NotificationBanners";
import AttendanceCard from "@/components/home/AttendanceCard";
import ChecklistSection from "@/components/home/ChecklistSection";
import NoticeSection from "@/components/home/NoticeSection";
import ScheduleSection from "@/components/home/ScheduleSection";
import SalarySection from "@/components/home/SalarySection";
import ClosingReport from "@/components/home/ClosingReport";
import BottomNav from "@/components/home/BottomNav";
import SideMenu from "@/components/menu/SideMenu";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto relative">
      <HomeHeader onMenuOpen={() => setMenuOpen(true)} />
      <div className="pb-20 overflow-y-auto">
        <NotificationBanners />
        <AttendanceCard />
        <ChecklistSection />
        <NoticeSection />
        <ScheduleSection />
        <SalarySection />
        <ClosingReport />
      </div>
      <BottomNav />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Index;
