import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  FileText,
  Headphones,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Phone,
  Printer,
  Search,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import { api } from "./services/api";

export function CopierVisual({ product, compact = false }) {
  return (
    <div className={`copier-visual ${compact ? "compact" : ""}`} style={{ "--machine-accent": product.accent }}>
      <div className="copier-screen" />
      <div className="copier-top" />
      <div className="copier-body">
        <div className="copier-paper">OFFICE ON</div>
        <div className="copier-panel" />
        <div className="copier-drawer" />
        <div className="copier-drawer" />
      </div>
    </div>
  );
}

export function CustomerLayout() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" onClick={close}>
            <span className="brand-mark"><Printer size={21} /></span>
            <span>오피스온<small>렌탈 통합솔루션</small></span>
          </Link>
          <nav className={`main-nav ${open ? "open" : ""}`}>
            <NavLink to="/products" onClick={close}>제품</NavLink>
            <NavLink to="/recommend" onClick={close}>맞춤 추천</NavLink>
            <NavLink to="/service" onClick={close}>AS 접수</NavLink>
            <NavLink to="/admin/login" onClick={close}>관리자</NavLink>
            <Link className="button accent small" to="/recommend" onClick={close}>무료 견적</Link>
          </nav>
          <button className="icon-button menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "메뉴 닫기" : "메뉴 열기"}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div><h3>오피스온</h3><p>제품 선택부터 견적, 설치, AS까지 연결하는 복합기 렌탈 통합플랫폼</p></div>
          <div><strong>고객지원</strong><Link to="/products">렌탈 제품</Link><Link to="/recommend">맞춤 견적</Link><Link to="/service">AS 접수</Link></div>
          <div><strong>상담안내</strong><p>대표전화 0000-0000</p><p>평일 09:00~18:00</p></div>
        </div>
        <div className="footer-bottom">© 2026 OFFICE ON. MVP DEMO.</div>
      </footer>
    </div>
  );
}

export function ProductCard({ product, selected, onCompare }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.recommended && <span className="badge recommended">추천</span>}
        <CopierVisual product={product} compact />
      </div>
      <div className="product-card-body">
        <div className="eyebrow">{product.maker} · {product.typeLabel}</div>
        <h3>{product.name}</h3>
        <p className="model">{product.model}</p>
        <div className="spec-chips">
          {product.features.slice(0, 3).map((feature) => <span key={feature}>{feature}</span>)}
        </div>
        <p className="range">권장 출력량 월 {product.minPrint.toLocaleString()}~{product.maxPrint.toLocaleString()}장</p>
        <div className="price"><small>월 렌탈료</small><strong>{product.basePrice.toLocaleString()}원부터</strong></div>
        {onCompare && (
          <label className="compare-check">
            <input type="checkbox" checked={selected} onChange={() => onCompare(product)} />
            <span>{selected && <Check size={14} />} 비교하기</span>
          </label>
        )}
        <div className="card-actions">
          <Link className="button secondary" to={`/products/${product.id}`}>상세보기</Link>
          <Link className="button primary" to={`/estimate?product=${product.id}`}>견적받기</Link>
        </div>
      </div>
    </article>
  );
}

const adminMenus = [
  ["/admin", "대시보드", BarChart3, true],
  ["/admin/inquiries", "상담 관리", MessageSquare],
  ["/admin/customers", "고객 관리", Building2],
  ["/admin/services", "AS 관리", Wrench],
];

export function AdminLayout({ admin, setAdmin }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try { await api.logout(); } catch { /* 세션이 만료돼도 화면에서는 로그아웃 */ }
    setAdmin(null);
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      {open && <button className="admin-backdrop" onClick={() => setOpen(false)} aria-label="메뉴 닫기" />}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <Link className="brand admin-brand" to="/admin"><span className="brand-mark"><Printer size={20} /></span><span>오피스온<small>관리자 시스템</small></span></Link>
        <nav>
          {adminMenus.map(([path, label, Icon, end]) => (
            <NavLink key={path} to={path} end={end} onClick={() => setOpen(false)}>
              <Icon size={19} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-note"><ShieldCheck size={18} /><span>로그인 사용자<br /><strong>{admin?.displayName}</strong></span></div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button className="icon-button admin-menu-button" onClick={() => setOpen(true)}><Menu /></button>
          <div><strong>렌탈 업무관리</strong><span>상담부터 AS까지 한곳에서 관리합니다.</span></div>
          <button className="logout-button" onClick={logout}><LogOut size={17} /> 로그아웃</button>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}

export function StatusBadge({ value, type = "inquiry" }) {
  const inquiryLabels = {
    new: "신규", checking: "확인 중", estimate_sent: "견적 발송",
    negotiating: "협의 중", contracted: "계약 완료", pending: "보류", closed: "종료",
  };
  const serviceLabels = {
    received: "접수", assigned: "기사 배정", scheduled: "방문 예정",
    processing: "처리 중", completed: "완료", cancelled: "취소",
  };
  const labels = type === "service" ? serviceLabels : inquiryLabels;
  return <span className={`status-badge ${value}`}>{labels[value] || value}</span>;
}

export function SectionHeading({ kicker, title, description, action }) {
  return (
    <div className="section-heading">
      <div><span className="eyebrow">{kicker}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon = Package, title, description }) {
  return <div className="empty-state"><Icon size={38} /><h3>{title}</h3><p>{description}</p></div>;
}

export function Loading() {
  return <div className="loading"><span /><p>데이터를 불러오는 중입니다.</p></div>;
}

export const featureOptions = [
  ["color", "컬러 출력"], ["a3", "A3 출력"], ["scan", "고속 스캔"],
  ["fax", "팩스"], ["duplex", "자동 양면"], ["wireless", "무선 출력"],
];
