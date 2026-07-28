import { useState } from "react";
import { LockKeyhole, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function AdminLogin({ setAdmin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await api.login(form);
      setAdmin(response.data);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-brand"><div className="brand-mark large"><Printer /></div><span className="eyebrow">OFFICE ON ADMIN</span><h1>상담부터 AS까지<br />한곳에서 관리하세요.</h1><p>복합기 렌탈업체를 위한 통합 업무관리 시스템</p></div>
      <form className="login-card" onSubmit={submit}>
        <LockKeyhole /><h2>관리자 로그인</h2><p>등록된 직원 계정으로 로그인하세요.</p>
        <label className="form-field">아이디<input autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label>
        <label className="form-field">비밀번호<input type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        {error && <p className="error-message">{error}</p>}
        <button className="button primary large full" disabled={loading}>{loading ? "로그인 중..." : "로그인"}</button>
        <small>관리자 생성: README의 `create_admin.php` 명령을 실행하세요.</small>
      </form>
    </section>
  );
}
