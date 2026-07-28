import { useEffect, useState } from "react";
import { EmptyState, Loading, StatusBadge } from "../../components";
import { api } from "../../services/api";

export default function Services() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const load = () => api.services().then((response) => setItems(response.data)).catch((err) => setError(err.message));
  useEffect(load, []);
  const update = async (item, status) => { await api.updateService({ id: Number(item.id), status, assignedTo: item.assigned_to || "" }); await load(); };
  return <section><header className="admin-page-title"><div><h1>AS 관리</h1><p>고장 접수부터 처리 완료까지 관리합니다.</p></div><strong>{items?.length || 0}건</strong></header>{error && <p className="error-message">{error}</p>}{!items ? <Loading /> : items.length ? <div className="table-wrap"><table><thead><tr><th>접수번호</th><th>고객사</th><th>장비</th><th>증상</th><th>긴급도</th><th>상태</th><th>상태 변경</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.service_number}</td><td><strong>{item.company_name}</strong><small>{item.contact_name} · {item.phone}</small></td><td>{item.equipment_model || "-"}</td><td className="symptom-cell">{item.symptom}</td><td><span className={`urgency ${item.urgency}`}>{item.urgency === "urgent" ? "긴급" : "일반"}</span></td><td><StatusBadge value={item.status} type="service" /></td><td><select value={item.status} onChange={(event) => update(item, event.target.value)}><option value="received">접수</option><option value="assigned">기사 배정</option><option value="scheduled">방문 예정</option><option value="processing">처리 중</option><option value="completed">완료</option><option value="cancelled">취소</option></select></td></tr>)}</tbody></table></div> : <EmptyState title="접수된 AS가 없습니다." description="고객의 AS 접수 내용이 이곳에 표시됩니다." />}</section>;
}
