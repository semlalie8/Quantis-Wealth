import * as math from 'mathjs';

interface AssetRiskInput {
  ticker: string;
  weight: number;
  prices: number[];
  currentPrice: number;
}

interface RiskAnalysisResult {
  portfolioVolatility: number;
  valueAtRisk95: number;
  valueAtRisk99: number;
  conditionalVaR95: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  diversificationScore: number;
  assetRiskContributions: { ticker: string; contribution: number; volatility: number }[];
  riskGrade: string;
  recommendation: string;
}

export class RiskService {
  /**
   * Comprehensive portfolio risk analysis using Modern Portfolio Theory metrics.
   */
  static analyzePortfolioRisk(assets: AssetRiskInput[]): RiskAnalysisResult {
    if (assets.length === 0) {
      return this.emptyAnalysis();
    }

    // Calculate returns for each asset
    const assetReturns = assets.map(a => {
      if (a.prices.length < 2) return [0];
      return a.prices.slice(0, -1).map((p, i) => (p - a.prices[i + 1]) / a.prices[i + 1]);
    });

    // Individual volatilities
    const volatilities = assetReturns.map(returns => {
      if (returns.length < 2) return 0.2;
      const mean = Number(math.mean(returns));
      const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1);
      return Math.sqrt(variance) * Math.sqrt(252); // Annualized
    });

    // Portfolio volatility (simplified — assumes zero correlation for demo)
    const weights = assets.map(a => a.weight);
    const portfolioVariance = weights.reduce((s, w, i) => s + (w ** 2) * (volatilities[i] ** 2), 0);
    const portfolioVolatility = Math.sqrt(portfolioVariance);

    // Portfolio returns series (weighted)
    const minLen = Math.min(...assetReturns.map(r => r.length));
    const portfolioReturns: number[] = [];
    for (let t = 0; t < minLen; t++) {
      let r = 0;
      for (let i = 0; i < assets.length; i++) {
        r += weights[i] * assetReturns[i][t];
      }
      portfolioReturns.push(r);
    }

    // Value at Risk (parametric)
    const meanReturn = portfolioReturns.length > 0 ? Number(math.mean(portfolioReturns)) : 0;
    const stdDev = portfolioReturns.length > 1 ? Number(math.std(portfolioReturns)) : 0.02;
    const totalValue = assets.reduce((s, a) => s + a.currentPrice * a.weight, 0);

    const valueAtRisk95 = -(meanReturn - 1.645 * stdDev) * totalValue;
    const valueAtRisk99 = -(meanReturn - 2.326 * stdDev) * totalValue;

    // Conditional VaR (Expected Shortfall)
    const sortedReturns = [...portfolioReturns].sort((a, b) => a - b);
    const cutoff = Math.floor(sortedReturns.length * 0.05);
    const tailReturns = sortedReturns.slice(0, Math.max(cutoff, 1));
    const conditionalVaR95 = tailReturns.length > 0 ? -Number(math.mean(tailReturns)) * totalValue : valueAtRisk95 * 1.2;

    // Sharpe Ratio (risk-free rate = 4.5%)
    const riskFreeRate = 0.045 / 252;
    const excessReturn = meanReturn - riskFreeRate;
    const sharpeRatio = stdDev > 0 ? (excessReturn / stdDev) * Math.sqrt(252) : 0;

    // Max Drawdown
    let maxDrawdown = 0;
    let peak = 1;
    let cumulativeReturn = 1;
    for (const r of portfolioReturns) {
      cumulativeReturn *= (1 + r);
      if (cumulativeReturn > peak) peak = cumulativeReturn;
      const drawdown = (peak - cumulativeReturn) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    // Beta (vs equal-weight benchmark)
    const beta = portfolioVolatility / 0.16; // 16% annualized benchmark vol

    // Diversification score
    const weightedAvgVol = weights.reduce((s, w, i) => s + w * volatilities[i], 0);
    const diversificationScore = weightedAvgVol > 0 ? 1 - (portfolioVolatility / weightedAvgVol) : 0;

    // Risk contributions
    const assetRiskContributions = assets.map((a, i) => ({
      ticker: a.ticker,
      contribution: portfolioVariance > 0
        ? (weights[i] ** 2 * volatilities[i] ** 2) / portfolioVariance
        : 1 / assets.length,
      volatility: volatilities[i],
    }));

    // Risk grade
    let riskGrade: string;
    let recommendation: string;

    if (portfolioVolatility < 0.10) {
      riskGrade = 'A — Conservative';
      recommendation = 'Portfolio is well-hedged. Consider increasing equity exposure for higher returns.';
    } else if (portfolioVolatility < 0.20) {
      riskGrade = 'B — Moderate';
      recommendation = 'Balanced risk profile. Maintain current allocation with periodic rebalancing.';
    } else if (portfolioVolatility < 0.35) {
      riskGrade = 'C — Aggressive';
      recommendation = 'Elevated volatility. Consider adding bonds or stable assets to reduce drawdown risk.';
    } else {
      riskGrade = 'D — Speculative';
      recommendation = 'High-risk exposure detected. Immediate rebalancing recommended to avoid capital erosion.';
    }

    return {
      portfolioVolatility: parseFloat(portfolioVolatility.toFixed(4)),
      valueAtRisk95: parseFloat(valueAtRisk95.toFixed(2)),
      valueAtRisk99: parseFloat(valueAtRisk99.toFixed(2)),
      conditionalVaR95: parseFloat(conditionalVaR95.toFixed(2)),
      sharpeRatio: parseFloat(sharpeRatio.toFixed(4)),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(4)),
      beta: parseFloat(beta.toFixed(2)),
      diversificationScore: parseFloat(diversificationScore.toFixed(4)),
      assetRiskContributions,
      riskGrade,
      recommendation,
    };
  }

  private static emptyAnalysis(): RiskAnalysisResult {
    return {
      portfolioVolatility: 0,
      valueAtRisk95: 0,
      valueAtRisk99: 0,
      conditionalVaR95: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      beta: 0,
      diversificationScore: 0,
      assetRiskContributions: [],
      riskGrade: 'N/A',
      recommendation: 'Add assets to your portfolio to receive risk analysis.',
    };
  }
}
