import { useEffect, useState } from "react";
import { Building2, FileText, MessageSquare, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, Loading, StatusBadge } from "../../components";
import { api } from "../../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.dashboard().then((response) => setData(response.data)).catch((err) => setError(err.message)); }, []);
  if (!data && !error) return <Loading />;

  return (
    <section>
      <header className="admin-page-title"><div><h1>대시보드</h1><p>오늘 확인해야 할 업무를 한눈에 살펴보세요.</p></div><span>{new Date().toLocaleDateString("ko-KR")}</span></header>
      {error && <p className="error-message">{error}</p>}
      {data && <>
        <div className="kpi-grid">
          {[[MessageSquare, "신규 상담", data.newInquiries, "/admin/inquiries"], [FileText, "진행 상담", data.activeInquiries, "/admin/inquiries"], [Building2, "전체 고객", data.customers, "/admin/customers"], [Wrench, "미완료 AS", data.openServices, "/admin/services"]].map(([Icon, label, value, path]) => <Link className="kpi-card" to={path} key={label}><span><Icon /></span><div><small>{label}</small><strong>{value}건</strong></div></Link>)}
        </div>
        <div className="dashboard-grid">
          <article className="admin-card"><div className="card-heading"><h2>최근 상담</h2><Link to="/admin/inquiries">전체 보기</Link></div>{data.recentInquiries.length ? <div className="compact-list">{data.recentInquiries.map((item) => <Link to={`/admin/inquiries/${item.id}`} key={item.id}><div><strong>{item.company_name}</strong><span>{item.product_model}</span></div><StatusBadge value={item.status} /></Link>)}</div> : <EmptyState title="등록된 상담이 없습니다." description="고객의 견적 신청이 이곳에 표시됩니다." />}</article>
          <article className="admin-card"><div className="card-heading"><h2>긴급 AS</h2><Link to="/admin/services">전체 보기</Link></div>{data.urgentServices.length ? <div className="compact-list">{data.urgentServices.map((item) => <div key={item.id}><div><strong>{item.company_name}</strong><span>{item.symptom}</span></div><StatusBadge value={item.status} type="service" /></div>)}</div> : <EmptyState icon={Wrench} title="긴급 AS가 없습니다." description="현재 긴급 처리 대상이 없습니다." />}</article>
        </div>
      </>}
    </section>
  );
}
