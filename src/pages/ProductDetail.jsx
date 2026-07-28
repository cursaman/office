import { CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CopierVisual } from "../components";
import { products } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  if (!product) return <div className="not-found"><h1>제품을 찾을 수 없습니다.</h1><Link to="/products">목록으로 이동</Link></div>;

  return (
    <section className="page-section">
      <div className="container detail-hero">
        <div className="detail-machine"><CopierVisual product={product} /></div>
        <div className="detail-summary">
          <span className="badge recommended">{product.typeLabel}</span>
          <p className="eyebrow">{product.maker}</p><h1>{product.name}</h1><strong className="detail-model">{product.model}</strong>
          <p>월 출력량 {product.minPrint.toLocaleString()}~{product.maxPrint.toLocaleString()}장에 적합한 {product.paper} {product.typeLabel} 복합기입니다.</p>
          <div className="feature-list">{product.features.map((feature) => <span key={feature}><CheckCircle2 size={17} />{feature}</span>)}</div>
          <div className="detail-price"><small>36개월 기준 예상 월 렌탈료</small><strong>{product.basePrice.toLocaleString()}원부터</strong></div>
          <div className="hero-actions"><Link className="button primary large" to={`/estimate?product=${product.id}`}>맞춤 견적받기</Link><a className="button secondary large" href="tel:00000000">전화 상담</a></div>
        </div>
      </div>
      <div className="container detail-sections">
        <article><h2>렌탈 조건</h2><dl className="condition-grid"><div><dt>계약기간</dt><dd>24·36·48개월</dd></div><div><dt>흑백 기본매수</dt><dd>{product.includedBlack.toLocaleString()}장</dd></div><div><dt>컬러 기본매수</dt><dd>{product.includedColor.toLocaleString()}장</dd></div><div><dt>유지관리</dt><dd>토너·정기점검·방문 AS</dd></div></dl></article>
        <p className="notice">실제 렌탈료는 설치환경, 계약기간, 출력량과 서비스 지역에 따라 달라질 수 있습니다.</p>
      </div>
    </section>
  );
}
