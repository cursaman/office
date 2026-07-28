import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, Loading, StatusBadge } from "../../components";
import { api } from "../../services/api";

export default function Inquiries() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.inquiries({ search, status }).then((response) => setItems(response.data)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [search, status]);

  return (
    <section>
      <header className="admin-page-title"><div><h1>상담 관리</h1><p>견적 신청부터 계약 완료까지 진행상태를 관리합니다.</p></div><strong>총 {items.length}건</strong></header>
      <div className="admin-filter-row"><label className="search-field"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="고객사·담당자·접수번호 검색" /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">전체 상태</option><option value="new">신규</option><option value="checking">확인 중</option><option value="estimate_sent">견적 발송</option><option value="negotiating">협의 중</option><option value="contracted">계약 완료</option><option value="pending">보류</option><option value="closed">종료</option></select></div>
      {error && <p className="error-message">{error}</p>}
      {loading ? <Loading /> : items.length ? (
        <div className="table-wrap"><table><thead><tr><th>접수번호</th><th>접수일</th><th>고객사</th><th>신청 제품</th><th>예상 월 금액</th><th>상태</th><th>담당자</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.inquiry_number}</td><td>{new Date(item.created_at).toLocaleDateString("ko-KR")}</td><td><strong>{item.company_name}</strong><small>{item.contact_name} · {item.phone}</small></td><td>{item.product_model}</td><td>{Number(item.monthly_price).toLocaleString()}원</td><td><StatusBadge value={item.status} /></td><td>{item.assigned_to || "미지정"}</td><td><Link className="table-link" to={`/admin/inquiries/${item.id}`}>상세보기</Link></td></tr>)}</tbody></table></div>
      ) : <EmptyState title="조건에 맞는 상담이 없습니다." description="고객이 견적을 신청하면 이곳에 표시됩니다." />}
    </section>
  );
}
