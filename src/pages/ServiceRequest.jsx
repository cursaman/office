import { useState } from "react";
import { CheckCircle2, Wrench } from "lucide-react";
import { api } from "../services/api";

const initial = { companyName: "", contactName: "", phone: "", equipmentModel: "", serialNumber: "", symptom: "", urgency: "normal", preferredDate: "" };

export default function ServiceRequest() {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (!form.companyName || !form.contactName || !form.phone || !form.symptom) return setError("고객사, 담당자, 연락처와 증상을 입력해 주세요.");
    try {
      const response = await api.createService(form);
      setMessage(`AS 접수가 완료되었습니다. 접수번호 ${response.data.serviceNumber}`);
      setError("");
      setForm(initial);
    } catch (requestError) { setError(requestError.message); }
  };

  return (
    <section className="page-section">
      <div className="container narrow">
        <header className="page-header centered"><span className="eyebrow">AFTER SERVICE</span><h1>복합기 AS 접수</h1><p>장비와 증상을 입력하면 관리자가 확인 후 방문 일정을 안내합니다.</p></header>
        {message ? <div className="success-box"><CheckCircle2 /><h2>접수 완료</h2><p>{message}</p><button className="button primary" onClick={() => setMessage("")}>추가 접수</button></div> : (
          <form className="wizard-card" onSubmit={submit}>
            <div className="service-form-title"><Wrench /><div><h2>고장·점검 요청</h2><p>필수정보를 정확하게 입력해 주세요.</p></div></div>
            <div className="form-grid">
              <label className="form-field">고객사 *<input name="companyName" value={form.companyName} onChange={change} /></label>
              <label className="form-field">담당자 *<input name="contactName" value={form.contactName} onChange={change} /></label>
              <label className="form-field">연락처 *<input name="phone" value={form.phone} onChange={change} /></label>
              <label className="form-field">장비 모델<input name="equipmentModel" value={form.equipmentModel} onChange={change} /></label>
              <label className="form-field">시리얼번호<input name="serialNumber" value={form.serialNumber} onChange={change} /></label>
              <label className="form-field">긴급도<select name="urgency" value={form.urgency} onChange={change}><option value="normal">일반</option><option value="urgent">긴급·업무 중단</option></select></label>
              <label className="form-field">방문 희망일<input type="date" name="preferredDate" value={form.preferredDate} onChange={change} /></label>
              <label className="form-field full">고장 증상 *<textarea name="symptom" value={form.symptom} onChange={change} rows="5" placeholder="용지걸림, 출력불량, 오류코드 등을 입력하세요." /></label>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="button primary large full">AS 접수하기</button>
          </form>
        )}
      </div>
    </section>
  );
}
