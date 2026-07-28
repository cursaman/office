import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function Complete() {
  const [params] = useSearchParams();
  return <section className="complete-page"><CheckCircle2 /><span className="eyebrow">REQUEST COMPLETE</span><h1>견적 신청이 완료되었습니다.</h1><p>담당자가 내용을 확인한 후 연락드리겠습니다.</p><div><span>접수번호</span><strong>{params.get("number") || "-"}</strong></div><div className="hero-actions"><Link className="button secondary" to="/products">다른 제품 보기</Link><Link className="button primary" to="/">메인으로 이동</Link></div></section>;
}
