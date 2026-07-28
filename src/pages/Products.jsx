import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, ProductCard } from "../components";
import { products } from "../data/products";

const initialFilters = { type: "", maker: "", minSpeed: "", fax: false, wireless: false };

export default function Products() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const [filters, setFilters] = useState(initialFilters);
  const [compare, setCompare] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const result = useMemo(() => products
    .filter((product) => {
      const keyword = search.trim().toLowerCase();
      return (
        (!keyword || `${product.maker} ${product.model} ${product.name}`.toLowerCase().includes(keyword)) &&
        (!filters.type || product.type === filters.type) &&
        (!filters.maker || product.maker === filters.maker) &&
        (!filters.minSpeed || product.speed >= Number(filters.minSpeed)) &&
        (!filters.fax || product.fax) &&
        (!filters.wireless || product.wireless)
      );
    })
    .sort((a, b) => sort === "price" ? a.basePrice - b.basePrice : sort === "speed" ? b.speed - a.speed : Number(b.recommended) - Number(a.recommended)),
  [search, filters, sort]);

  const toggleCompare = (product) => {
    if (compare.some((item) => item.id === product.id)) {
      setCompare(compare.filter((item) => item.id !== product.id));
    } else if (compare.length < 3) {
      setCompare([...compare, product]);
    } else {
      window.alert("제품은 최대 3개까지 비교할 수 있습니다.");
    }
  };

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <section className="page-section">
      <div className="container">
        <header className="page-header"><span className="eyebrow">RENTAL PRODUCTS</span><h1>렌탈 복합기</h1><p>업무환경에 맞는 제품을 검색하고 비교해 보세요.</p></header>
        <div className="product-toolbar">
          <label className="search-field"><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="제품명·모델명·제조사 검색" /></label>
          <button className="button secondary mobile-filter" onClick={() => setFilterOpen(true)}><SlidersHorizontal size={17} /> 필터</button>
          <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">추천순</option><option value="price">낮은 가격순</option><option value="speed">출력속도순</option></select>
        </div>
        <div className="products-layout">
          <aside className={`filter-panel ${filterOpen ? "open" : ""}`}>
            <div className="filter-title"><h2>제품 필터</h2><button onClick={() => setFilterOpen(false)}><X /></button></div>
            <label>출력 방식<select name="type" value={filters.type} onChange={change}><option value="">전체</option><option value="color">컬러</option><option value="mono">흑백</option></select></label>
            <label>제조사<select name="maker" value={filters.maker} onChange={change}><option value="">전체</option><option>삼성</option><option>캐논</option><option>후지필름</option></select></label>
            <label>출력 속도<select name="minSpeed" value={filters.minSpeed} onChange={change}><option value="">전체</option><option value="25">25매 이상</option><option value="30">30매 이상</option><option value="35">35매 이상</option></select></label>
            <label className="check-row"><input type="checkbox" name="fax" checked={filters.fax} onChange={change} /> 팩스 지원</label>
            <label className="check-row"><input type="checkbox" name="wireless" checked={filters.wireless} onChange={change} /> 무선 출력</label>
            <button className="button secondary full" onClick={() => setFilters(initialFilters)}>전체 초기화</button>
          </aside>
          <div className="product-result">
            <div className="result-count">총 <strong>{result.length}</strong>개 제품</div>
            {result.length ? <div className="product-grid">{result.map((product) => <ProductCard key={product.id} product={product} selected={compare.some((item) => item.id === product.id)} onCompare={toggleCompare} />)}</div> : <EmptyState title="조건에 맞는 제품이 없습니다." description="검색어나 필터를 변경해 주세요." />}
          </div>
        </div>
      </div>
      {compare.length > 0 && (
        <div className="compare-bar"><div className="container compare-inner"><div><strong>비교 제품 {compare.length}/3</strong>{compare.map((product) => <span key={product.id}>{product.model}<button onClick={() => toggleCompare(product)}>×</button></span>)}</div>{compare.length >= 2 ? <Link className="button primary" to={`/products?compare=${compare.map((item) => item.id).join(",")}`} onClick={() => window.alert(compare.map((item) => `${item.model}: ${item.speed}매 / ${item.basePrice.toLocaleString()}원`).join("\n"))}>선택 제품 비교</Link> : <small>2개 이상 선택하세요.</small>}</div></div>
      )}
    </section>
  );
}
