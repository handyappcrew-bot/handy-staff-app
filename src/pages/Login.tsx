import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (id === "01050505050" && password === "1234") {
      setError("");
      navigate("/");
    } else {
      setError("아이디 또는 비밀번호가 일치하지 않습니다");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && id && password) handleLogin();
  };

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto font-[Pretendard]">
      <div className="flex flex-col justify-center px-[20px] pt-[20vh]">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-[28px] font-bold text-primary">HANDY</h1>
          <p className="mt-2 text-[14px] text-[hsl(223,5%,46%)]">직원 관리 서비스</p>
        </div>

        <div className="space-y-4">
          {/* 아이디 */}
          <div>
            <label className="text-[14px] font-medium text-[hsl(210,5%,16%)]">아이디</label>
            <input
              type="text"
              inputMode="numeric"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="전화번호 입력"
              className="mt-2 w-full h-[52px] rounded-xl border border-border px-4 text-[16px] text-[hsl(210,5%,16%)] placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="text-[14px] font-medium text-[hsl(210,5%,16%)]">비밀번호</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호 입력"
                className="w-full h-[52px] rounded-xl border border-border px-4 pr-12 text-[16px] text-[hsl(210,5%,16%)] placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pressable absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-destructive text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={!id || !password}
            className={`pressable w-full py-4 rounded-xl text-[16px] font-semibold mt-4 ${
              id && password
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
