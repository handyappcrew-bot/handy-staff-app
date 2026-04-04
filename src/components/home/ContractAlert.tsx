import { useEffect, useState, useRef } from "react";
import { useNavToast } from "@/hooks/use-nav-toast";

interface ContractAlertProps {
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const ContractAlert = ({ scrollRef }: ContractAlertProps) => {
  const { navigateTo } = useNavToast();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const el = scrollRef?.current ?? window;
    const handleScroll = () => {
      const scrollTop = scrollRef?.current
        ? scrollRef.current.scrollTop
        : window.scrollY;
      setCollapsed(scrollTop > 30);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const handleClick = () => {
    navigateTo("/profile/edit", "내 정보 수정으로 이동했어요", { showLoading: true, forceAll: true, state: { scrollToContract: true } });
  };

  return (
    <div
      className="fixed z-40"
      style={{
        bottom: "calc(74px + env(safe-area-inset-bottom) + 10px)",
        right: "20px",
        left: collapsed ? "auto" : "20px",
        maxWidth: "calc(min(100vw, 512px) - 40px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <button
          onClick={handleClick}
          className="pressable"
          style={{
            backgroundColor: "#FF3D3D",
            borderRadius: "26px",
            height: "52px",
            width: collapsed ? "52px" : "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: collapsed ? 0 : "10px",
            padding: collapsed ? "0" : "0 16px 0 14px",
            overflow: "hidden",
            transition: "width 0.55s cubic-bezier(0.4,0,0.2,1), border-radius 0.55s ease",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(255,61,61,0.45)",
            position: "relative",
          }}
        >
          {/* 아이콘 영역 — 흔들림 + 뱃지 */}
          <div style={{ position: "relative", flexShrink: 0, width: "26px", height: "26px" }}>
            {/* 경고 뱃지 */}
            <div style={{
              position: "absolute",
              top: "-4px", right: "-4px",
              width: "10px", height: "10px",
              borderRadius: "50%",
              backgroundColor: "#FFD600",
              border: "2px solid #FF3D3D",
              animation: "contractBadgePulse 1.8s ease-in-out infinite",
              zIndex: 1,
            }} />
            {/* 계약서 아이콘 SVG */}
            <svg
              width="26" height="26" viewBox="0 0 24 24" fill="none"
              style={{ animation: "contractShake 2.5s ease-in-out infinite" }}
            >
              <rect x="4" y="2" width="13" height="17" rx="2" fill="#FFEAE6" opacity="0.15" stroke="#FFEAE6" strokeWidth="1.5"/>
              <path d="M8 7h6M8 10h6M8 13h4" stroke="#FFEAE6" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="17" cy="17" r="4.5" fill="#FF3D3D" stroke="#FFEAE6" strokeWidth="1.5"/>
              <path d="M17 15v2.5M17 19h.01" stroke="#FFEAE6" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <span
            style={{
              color: "#FFEAE6",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              flex: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : "100%",
              textAlign: "left",
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.2s ease, max-width 0.55s ease, flex 0.55s ease",
              overflow: "hidden",
            }}
          >
            전체 필수 계약서를 제출 완료 해주세요
          </span>

          {/* 오른쪽 화살표 — 펼쳐진 상태에서만 */}
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{
              flexShrink: 0,
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : "16px",
              transition: "opacity 0.2s ease, max-width 0.55s ease",
              overflow: "hidden",
            }}
          >
            <path d="M6 4l4 4-4 4" stroke="#FFEAE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <style>{`
            @keyframes contractShake {
              0%, 60%, 100% { transform: rotate(0deg); }
              65% { transform: rotate(-8deg); }
              70% { transform: rotate(8deg); }
              75% { transform: rotate(-6deg); }
              80% { transform: rotate(6deg); }
              85% { transform: rotate(0deg); }
            }
            @keyframes contractBadgePulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.4); opacity: 0.7; }
            }
          `}</style>
        </button>
      </div>
    </div>
  );
};

export default ContractAlert;
