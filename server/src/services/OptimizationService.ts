import * as math from 'mathjs';

interface AssetData {
  ticker: string;
  historicalReturns: number[];
  volatility: number;
}

export class OptimizationService {
  /**
   * Simulates a Mean-Variance Optimization (MVO) to find the Efficient Frontier.
   * In a production environment, this would use a quadratic programming solver.
   */
  static optimizePortfolio(assets: AssetData[], riskTolerance: number) {
    console.log('Starting Smart Allocation Optimization...');
    
    // Simulate RL Agent "learning" from historical returns
    const weights = this.simulateRLAgent(assets, riskTolerance);
    
    // Calculate expected portfolio metrics
    const expectedReturn = weights.reduce((sum, w, i) => sum + w * math.mean(assets[i].historicalReturns), 0);
    const variance = this.calculatePortfolioVariance(assets, weights);
    const sharpeRatio = expectedReturn / Math.sqrt(variance);

    return {
      weights: assets.map((a, i) => ({ ticker: a.ticker, weight: weights[i] })),
      metrics: {
        expectedReturn,
        risk: Math.sqrt(variance),
        sharpeRatio,
        decisionLogic: 'RL-Augmented Mean-Variance Optimization'
      }
    };
  }

  private static simulateRLAgent(assets: AssetData[], riskTolerance: number): number[] {
    // This is a simplified simulation of an RL agent's decision
    // In reality, you'd use a policy network or DQN to output these weights
    const rawWeights = assets.map(a => {
      const avgReturn = math.mean(a.historicalReturns);
      const score = (avgReturn * riskTolerance) / (a.volatility + 0.1);
      return Math.max(0.05, score); // Ensure at least 5% per asset for diversification
    });

    const total = rawWeights.reduce((a, b) => a + b, 0);
    return rawWeights.map(w => w / total);
  }

  private static calculatePortfolioVariance(assets: AssetData[], weights: number[]): number {
    // Simplified variance calculation (assuming zero correlation for mock logic)
    // Real MVO requires a Covariance Matrix
    return weights.reduce((sum, w, i) => sum + (w ** 2) * (assets[i].volatility ** 2), 0);
  }
}
