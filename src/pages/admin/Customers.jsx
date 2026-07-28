import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { EmptyState, Loading } from "../../components";
import { api } from "../../services/api";

export default function Customers() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.customers().then((response) => setItems(response.data)).catch((err) => setError(err.message)); }, []);
  return <section><header className="admin-page-title"><div><h1>고객 관리</h1><p>고객사와 상담·AS 현황을 확인합니다.</p></div></header>{error && <p className="error-message">{error}</p>}{!items ? <Loading /> : items.length ? <div className="customer-admin-grid">{items.map((item) => <article className="customer-admin-card" key={item.id}><span><Building2 /></span><div><h3>{item.company_name}</h3><p>{item.contact_name} · {item.phone}</p><small>{item.address}</small></div><dl><div><dt>상담</dt><dd>{item.inquiry_count}건</dd></div><div><dt>AS</dt><dd>{item.service_count}건</dd></div></dl></article>)}</div> : <EmptyState icon={Building2} title="등록된 고객이 없습니다." description="견적 신청 고객이 자동으로 등록됩니다." />}</section>;
}
