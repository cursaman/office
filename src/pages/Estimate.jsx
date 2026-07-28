import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CopierVisual } from "../components";
import { products } from "../data/products";
import { api } from "../services/api";
import { calculateEstimate } from "../utils/recommend";

const emptyCustomer = { companyName: "", contactName: "", phone: "", email: "", address: "", preferredContactTime: "", requestMessage: "", privacy: false };

export default function Estimate() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const product = products.find((item) => item.id === Number(params.get("product"))) || products[0];
  const stored = sessionStorage.getItem("recommendAnswers");
  const answers = location.state?.answers || (stored ? JSON.parse(stored) : {
    industry: "office", employees: 10, monthlyPrints: 3000, colorRatio: product.type === "color" ? 30 : 0,
    features: ["scan", "duplex"], contractMonths: 36, region: "부산광역시", installDate: "",
  });
  const estimate = useMemo(() => calculateEstimate(product, answers), [product, answers]);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setCustomer((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!customer.companyName.trim() || !customer.contactName.trim() || !customer.phone.trim() || !customer.address.trim()) return setError("회사명, 담당자, 연락처와 설치주소를 입력해 주세요.");
    if (!customer.privacy) return setError("개인정보 수집·이용에 동의해 주세요.");
    try {
      setSubmitting(true);
      const response = await api.createInquiry({
        customer,
        product: { id: product.id, name: product.name, model: product.model },
        requirements: answers,
        estimate,
      });
      sessionStorage.removeItem("recommendAnswers");
      navigate(`/estimate/complete?number=${response.data.inquiryNumber}`, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section soft-section">
      <div className="container">
        <header className="page-header centered"><span className="eyebrow">AUTO ESTIMATE</span><h1>예상 렌탈 견적</h1><p>추천 결과를 바탕으로 계산한 예상 금액입니다.</p></header>
        <div className="estimate-grid">
          <article className="estimate-product-card"><CopierVisual product={product} compact /><div><span className="eyebrow">{product.maker}</span><h2>{product.name}</h2><strong>{product.model}</strong><div className="spec-chips">{product.features.map((item) => <span key={item}>{item}</span>)}</div></div></article>
          <article className="estimate-box"><h2>월 예상금액</h2><dl><div><dt>제품 기본료</dt><dd>{estimate.basePrice.toLocaleString()}원</dd></div><div><dt>출력량 추가비</dt><dd>{estimate.printCharge.toLocaleString()}원</dd></div><div><dt>옵션 비용</dt><dd>{estimate.optionCharge.toLocaleString()}원</dd></div><div><dt>지역 추가비</dt><dd>{estimate.regionCharge.toLocaleString()}원</dd></div><div><dt>계약기간 할인</dt><dd>-{estimate.contractDiscount.toLocaleString()}원</dd></div><div className="total"><dt>예상 월 렌탈료</dt><dd>{estimate.monthlyPrice.toLocaleString()}원</dd></div></dl><p>실제 금액은 설치환경과 최종 계약조건에 따라 달라질 수 있습니다.</p></article>
        </div>
        <form className="inquiry-form" onSubmit={submit}>
          <div className="section-heading"><div><span className="eyebrow">CONTACT</span><h2>정식 견적 신청</h2><p>담당자가 확인한 후 입력한 연락처로 안내합니다.</p></div></div>
          <div className="form-grid">
            <label className="form-field">회사명 *<input name="companyName" value={customer.companyName} onChange={change} /></label>
            <label className="form-field">담당자명 *<input name="contactName" value={customer.contactName} onChange={change} /></label>
            <label className="form-field">연락처 *<input name="phone" value={customer.phone} onChange={change} placeholder="010-0000-0000" /></label>
            <label className="form-field">이메일<input type="email" name="email" value={customer.email} onChange={change} /></label>
            <label className="form-field full">설치 주소 *<input name="address" value={customer.address} onChange={change} /></label>
            <label className="form-field">상담 희망시간<select name="preferredContactTime" value={customer.preferredContactTime} onChange={change}><option value="">시간 선택</option><option>오전 09:00~12:00</option><option>오후 13:00~15:00</option><option>오후 15:00~18:00</option></select></label>
            <label className="form-field full">추가 요청사항<textarea name="requestMessage" value={customer.requestMessage} onChange={change} rows="4" /></label>
          </div>
          <label className="privacy-row"><input type="checkbox" name="privacy" checked={customer.privacy} onChange={change} /> 견적 상담을 위한 개인정보 수집·이용에 동의합니다.</label>
          {error && <p className="error-message">{error}</p>}
          <button className="button accent large full" disabled={submitting}>{submitting ? "신청 중..." : "정식 견적 요청하기"}</button>
        </form>
      </div>
    </section>
  );
}
