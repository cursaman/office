import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Headphones, Settings2, Sparkles, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { CopierVisual, ProductCard, SectionHeading } from "../components";
import { products } from "../data/products";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-label"><Sparkles size={15} /> 업무에 맞는 복합기를 1분 안에</span>
            <h1>복잡한 비교 없이<br /><em>딱 맞는 복합기</em>를 찾으세요.</h1>
            <p>출력량과 필요한 기능만 알려주시면 제품 추천부터 예상 렌탈료, 설치와 AS까지 한 번에 연결합니다.</p>
            <div className="hero-actions">
              <Link className="button accent large" to="/recommend">맞춤 추천 시작 <ArrowRight size={18} /></Link>
              <Link className="button secondary large" to="/products">전체 제품 보기</Link>
            </div>
            <div className="hero-trust">
              <span><CheckCircle2 /> 설치·토너·AS 포함</span>
              <span><CheckCircle2 /> 부산·김해·양산 방문</span>
            </div>
          </div>
          <div className="hero-machine">
            <span className="floating-tag tag-a">A3 컬러</span>
            <span className="floating-tag tag-b">고속 스캔</span>
            <span className="floating-tag tag-c">방문 AS</span>
            <CopierVisual product={products[0]} />
          </div>
        </div>
      </section>

      <section className="metric-band">
        <div className="container metric-grid">
          <div><strong>맞춤형</strong><span>업종·출력량 기반 추천</span></div>
          <div><strong>자동</strong><span>예상 렌탈료 계산</span></div>
          <div><strong>통합</strong><span>고객·상담·AS 관리</span></div>
          <div><strong>신속</strong><span>접수 상태 실시간 관리</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading kicker="POPULAR PRODUCTS" title="업무 현장에서 많이 찾는 제품" description="출력량과 업무방식에 따라 경제형부터 고성능형까지 비교해 보세요." action={<Link className="text-link" to="/products">전체 제품 <ArrowRight size={16} /></Link>} />
          <div className="product-grid home-products">
            {products.filter((product) => product.recommended).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <SectionHeading kicker="HOW IT WORKS" title="상담부터 관리까지 끊김 없이" description="홈페이지가 아니라 실제 렌탈 업무를 지원하는 서비스입니다." />
          <div className="steps-grid">
            {[
              [Settings2, "01", "조건 입력", "업종과 월 출력량, 필요한 기능을 선택합니다."],
              [Sparkles, "02", "제품 추천", "조건별 점수를 계산해 적합한 제품을 제안합니다."],
              [FileCheck2, "03", "자동 견적", "계약기간과 옵션을 반영해 예상금액을 계산합니다."],
              [Wrench, "04", "설치·AS", "설치장비와 AS 처리상태를 지속적으로 관리합니다."],
            ].map(([Icon, number, title, text]) => (
              <article className="step-card" key={number}><span>{number}</span><Icon /><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container service-feature">
          <div>
            <span className="eyebrow">AFTER SERVICE</span>
            <h2>계약보다 중요한 것은<br />문제가 생겼을 때의 대응입니다.</h2>
            <p>고객은 장비를 선택해 증상을 접수하고 관리자는 처리상태를 관리합니다. 반복 고장과 서비스 이력이 고객별로 쌓입니다.</p>
            <ul>
              <li><Clock3 /> 방문 희망일과 긴급도 접수</li>
              <li><Headphones /> 고객·장비별 서비스 이력</li>
              <li><Wrench /> 기사 배정과 처리상태 관리</li>
            </ul>
            <Link className="button primary" to="/service">AS 접수하기</Link>
          </div>
          <div className="service-panel">
            <div className="service-panel-head"><span>서비스 진행 현황</span><strong>접수번호 AS-2026-0041</strong></div>
            {["접수 완료", "내용 확인", "기사 배정", "방문 예정"].map((text, index) => <div className={`timeline-row ${index < 3 ? "done" : ""}`} key={text}><span>{index < 3 ? "✓" : index + 1}</span><strong>{text}</strong><small>{index < 3 ? "처리 완료" : "오늘 14:00"}</small></div>)}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner"><div><span>무료 맞춤 상담</span><h2>어떤 복합기가 맞는지 고민되시나요?</h2><p>사용 조건만 알려주시면 추천 제품과 예상 렌탈료를 바로 확인할 수 있습니다.</p></div><Link className="button accent large" to="/recommend">1분 맞춤 견적 <ArrowRight size={18} /></Link></div>
      </section>
    </>
  );
}
