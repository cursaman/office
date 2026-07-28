import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { featureOptions, ProductCard } from "../components";
import { industryOptions, products } from "../data/products";
import { recommendProducts } from "../utils/recommend";

const initial = {
  industry: "",
  employees: 10,
  monthlyPrints: 3000,
  colorRatio: 30,
  features: ["scan", "duplex"],
  contractMonths: 36,
  region: "부산광역시",
  installDate: "",
};

export default function Recommend() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState(initial);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const update = (name, value) => {
    setAnswers((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const toggleFeature = (feature) => {
    setAnswers((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }));
  };

  const next = () => {
    if (step === 1 && !answers.industry) return setError("업종을 선택해 주세요.");
    if (step === 3 && answers.features.length === 0) return setError("필요 기능을 한 개 이상 선택해 주세요.");
    if (step === 4 && !answers.region.trim()) return setError("설치지역을 입력해 주세요.");
    if (step < 4) setStep(step + 1);
    else {
      sessionStorage.setItem("recommendAnswers", JSON.stringify(answers));
      setResult(recommendProducts(products, answers));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (result) {
    return (
      <section className="page-section soft-section">
        <div className="container narrow">
          <header className="page-header centered"><span className="eyebrow">MATCHING RESULT</span><h1>조건에 맞는 제품을 찾았습니다.</h1><p>점수와 추천 이유를 확인한 뒤 예상 견적을 계산해 보세요.</p></header>
          <div className="answer-summary">
            <span>업종 <strong>{industryOptions.find((item) => item.value === answers.industry)?.label}</strong></span>
            <span>월 출력량 <strong>{answers.monthlyPrints.toLocaleString()}장</strong></span>
            <span>계약 <strong>{answers.contractMonths}개월</strong></span>
            <button onClick={() => setResult(null)}>조건 수정</button>
          </div>
          <div className="recommend-list">
            {result.map((product, index) => (
              <article className={`recommend-card ${index === 0 ? "best" : ""}`} key={product.id}>
                <div className="recommend-rank"><strong>{index + 1}순위</strong><span>{index === 0 ? "가장 적합한 제품" : "대안 제품"}</span></div>
                <ProductCard product={product} />
                <div className="recommend-reasons"><strong>적합도 {product.score}점</strong>{product.reasons.map((reason) => <p key={reason}><Check size={15} />{reason}</p>)}<button className="button accent full" onClick={() => navigate(`/estimate?product=${product.id}`, { state: { answers } })}>이 제품 예상 견적</button></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container narrow">
        <header className="page-header centered"><span className="eyebrow">SMART MATCHING</span><h1>맞춤 복합기 추천</h1><p>복합기를 잘 몰라도 업무조건만 입력하면 됩니다.</p></header>
        <div className="progress-wrap"><div><strong>{step}/4단계</strong><span>{["업무환경", "출력량", "필요 기능", "계약조건"][step - 1]}</span></div><div className="progress-track"><span style={{ width: `${step * 25}%` }} /></div></div>
        <div className="wizard-card">
          {step === 1 && <div><h2>어떤 환경에서 사용하시나요?</h2><div className="choice-grid">{industryOptions.map((item) => <button className={`choice-card ${answers.industry === item.value ? "selected" : ""}`} key={item.value} onClick={() => update("industry", item.value)}><strong>{item.label}</strong><small>{item.description}</small></button>)}</div><label className="form-field">직원 수<input type="number" min="1" value={answers.employees} onChange={(event) => update("employees", Number(event.target.value))} /></label></div>}
          {step === 2 && <div><h2>월 출력량과 컬러 비율은 어느 정도인가요?</h2><div className="range-box"><label>월 출력량 <strong>{answers.monthlyPrints.toLocaleString()}장</strong><input type="range" min="500" max="15000" step="500" value={answers.monthlyPrints} onChange={(event) => update("monthlyPrints", Number(event.target.value))} /></label><label>컬러 비율 <strong>{answers.colorRatio}%</strong><input type="range" min="0" max="100" step="10" value={answers.colorRatio} onChange={(event) => update("colorRatio", Number(event.target.value))} /></label></div></div>}
          {step === 3 && <div><h2>필요한 기능을 선택해 주세요.</h2><div className="choice-grid">{featureOptions.map(([value, label]) => <button className={`choice-card ${answers.features.includes(value) ? "selected" : ""}`} key={value} onClick={() => toggleFeature(value)}><strong>{label}</strong><small>복수 선택 가능</small></button>)}</div></div>}
          {step === 4 && <div><h2>계약과 설치 조건을 알려주세요.</h2><div className="form-grid"><label className="form-field">계약기간<select value={answers.contractMonths} onChange={(event) => update("contractMonths", Number(event.target.value))}><option value="24">24개월</option><option value="36">36개월</option><option value="48">48개월</option></select></label><label className="form-field">설치지역<input value={answers.region} onChange={(event) => update("region", event.target.value)} /></label><label className="form-field full">설치 희망일<input type="date" value={answers.installDate} onChange={(event) => update("installDate", event.target.value)} /></label></div></div>}
          {error && <p className="error-message">{error}</p>}
          <div className="wizard-actions">{step > 1 && <button className="button secondary" onClick={() => setStep(step - 1)}>이전 단계</button>}<button className="button primary" onClick={next}>{step === 4 ? "추천 결과 확인" : "다음 단계"}</button></div>
        </div>
      </div>
    </section>
  );
}
