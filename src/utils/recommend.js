export function recommendProducts(products, answers) {
  const wantsColor = answers.features.includes("color") || answers.colorRatio >= 30;

  return products
    .map((product) => {
      let score = 0;
      const reasons = [];

      if (answers.monthlyPrints >= product.minPrint && answers.monthlyPrints <= product.maxPrint) {
        score += 35;
        reasons.push("월 출력량이 권장 범위에 적합합니다.");
      } else {
        const gap = Math.min(
          Math.abs(answers.monthlyPrints - product.minPrint),
          Math.abs(answers.monthlyPrints - product.maxPrint),
        );
        score += gap <= 1500 ? 15 : -10;
      }

      if (wantsColor === (product.type === "color")) {
        score += 25;
        reasons.push(wantsColor ? "컬러 출력 조건과 일치합니다." : "흑백 중심으로 비용 효율이 좋습니다.");
      } else {
        score -= 35;
      }

      if (product.industries.includes(answers.industry)) {
        score += 15;
        reasons.push("선택한 업종에서 활용도가 높습니다.");
      }

      for (const feature of answers.features) {
        if (feature === "fax") score += product.fax ? 10 : -20;
        if (feature === "wireless") score += product.wireless ? 10 : -15;
        if (feature === "scan") score += product.scan ? 5 : -15;
        if (feature === "duplex") score += product.duplex ? 5 : -15;
        if (feature === "a3") score += product.paper === "A3" ? 5 : -20;
      }

      if (answers.employees >= 25 && product.speed >= 30) {
        score += 10;
        reasons.push("직원 수에 맞는 출력 속도입니다.");
      }

      return {
        ...product,
        score: Math.max(0, score),
        reasons: [...new Set(reasons)].slice(0, 3),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function calculateEstimate(product, answers) {
  const colorRatio = product.type === "color" ? answers.colorRatio / 100 : 0;
  const colorPages = Math.round(answers.monthlyPrints * colorRatio);
  const blackPages = answers.monthlyPrints - colorPages;
  const blackCharge = Math.max(0, blackPages - product.includedBlack) * product.blackOver;
  const colorCharge = Math.max(0, colorPages - product.includedColor) * product.colorOver;
  const optionCharge =
    (answers.features.includes("fax") && !product.fax ? 10000 : 0) +
    (answers.features.includes("wireless") && !product.wireless ? 5000 : 0);
  const regionCharge = /부산|김해|양산/.test(answers.region) ? 0 : 20000;
  const discountRate = answers.contractMonths === 48 ? 0.1 : answers.contractMonths === 36 ? 0.05 : 0;
  const contractDiscount = Math.round(product.basePrice * discountRate);
  const printCharge = blackCharge + colorCharge;
  const monthlyPrice = product.basePrice + printCharge + optionCharge + regionCharge - contractDiscount;

  return {
    basePrice: product.basePrice,
    printCharge,
    optionCharge,
    regionCharge,
    contractDiscount,
    monthlyPrice: Math.max(0, monthlyPrice),
  };
}
