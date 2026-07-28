import { useEffect, useState } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Loading, StatusBadge } from "../../components";
import { api } from "../../services/api";

export default function InquiryDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [note, setNote] = useState("");
  const [nextContactDate, setNextContactDate] = useState("");
  const [error, setError] = useState("");
  const load = () => api.inquiry(id).then((response) => setDetail(response.data)).catch((err) => setError(err.message));
  useEffect(load, [id]);
  if (!detail && !error) return <Loading />;
  if (error) return <p className="error-message">{error}</p>;
  const { inquiry, notes, history } = detail;

  const update = async (patch) => {
    try {
      await api.updateInquiry({ id: Number(id), status: patch.status ?? inquiry.status, assignedTo: patch.assignedTo ?? inquiry.assigned_to ?? "", nextContactDate: patch.nextContactDate ?? inquiry.next_contact_date ?? "", reason: "관리자 화면 변경" });
      await load();
    } catch (err) { setError(err.message); }
  };

  const submitNote = async (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    await api.addNote({ inquiryId: Number(id), content: note, nextContactDate });
    setNote(""); setNextContactDate(""); await load();
  };

  return (
    <section>
      <Link className="back-link" to="/admin/inquiries"><ArrowLeft size={16} /> 상담 목록</Link>
      <header className="admin-page-title detail-title"><div><StatusBadge value={inquiry.status} /><h1>{inquiry.company_name}</h1><p>{inquiry.inquiry_number}</p></div><div className="detail-controls"><select value={inquiry.assigned_to || ""} onChange={(event) => update({ assignedTo: event.target.value })}><option value="">담당자 미지정</option><option>김영업</option><option>이영업</option><option>박관리</option></select><select value={inquiry.status} onChange={(event) => update({ status: event.target.value })}><option value="new">신규</option><option value="checking">확인 중</option><option value="estimate_sent">견적 발송</option><option value="negotiating">협의 중</option><option value="contracted">계약 완료</option><option value="pending">보류</option><option value="closed">종료</option></select></div></header>
      <div className="detail-admin-grid">
        <main>
          <article className="admin-card"><h2>고객·사용 조건</h2><dl className="info-grid"><div><dt>담당자</dt><dd>{inquiry.contact_name}</dd></div><div><dt>연락처</dt><dd><a href={`tel:${inquiry.phone}`}><Phone size={15} />{inquiry.phone}</a></dd></div><div><dt>설치주소</dt><dd>{inquiry.address}</dd></div><div><dt>업종</dt><dd>{inquiry.industry}</dd></div><div><dt>월 출력량</dt><dd>{Number(inquiry.monthly_prints).toLocaleString()}장</dd></div><div><dt>필요 기능</dt><dd>{inquiry.features.join(", ")}</dd></div></dl></article>
          <article className="admin-card"><h2>상담 메모</h2><form className="note-form" onSubmit={submitNote}><textarea rows="4" value={note} onChange={(event) => setNote(event.target.value)} placeholder="통화내용과 다음 행동을 기록하세요." /><div><label>다음 연락일<input type="date" value={nextContactDate} onChange={(event) => setNextContactDate(event.target.value)} /></label><button className="button primary">메모 등록</button></div></form><div className="notes-list">{notes.length ? notes.map((item) => <div key={item.id}><p>{item.content}</p><small>{item.created_by} · {new Date(item.created_at).toLocaleString("ko-KR")}</small>{item.next_contact_date && <strong>다음 연락 {item.next_contact_date}</strong>}</div>) : <p>등록된 메모가 없습니다.</p>}</div></article>
        </main>
        <aside>
          <article className="admin-card estimate-side"><h2>신청 제품·견적</h2><strong>{inquiry.product_name}</strong><span>{inquiry.product_model}</span><dl><div><dt>기본료</dt><dd>{Number(inquiry.base_price).toLocaleString()}원</dd></div><div><dt>추가비</dt><dd>{(Number(inquiry.print_charge) + Number(inquiry.option_charge) + Number(inquiry.region_charge)).toLocaleString()}원</dd></div><div><dt>할인</dt><dd>-{Number(inquiry.contract_discount).toLocaleString()}원</dd></div><div className="total"><dt>예상 월 금액</dt><dd>{Number(inquiry.monthly_price).toLocaleString()}원</dd></div></dl></article>
          <article className="admin-card"><h2>상태 변경 이력</h2><div className="history-list">{history.map((item) => <div key={item.id}><StatusBadge value={item.new_status} /><small>{item.changed_by}<br />{new Date(item.changed_at).toLocaleString("ko-KR")}</small></div>)}</div></article>
        </aside>
      </div>
    </section>
  );
}
