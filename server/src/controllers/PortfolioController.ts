import { Request, Response } from 'express';
import { prisma } from '../index';
import { OptimizationService } from '../services/OptimizationService';
import { RiskService } from '../services/RiskService';
import { z } from 'zod';

const CreatePortfolioSchema = z.object({
  name: z.string().min(1),
  userId: z.string().uuid(),
  targetReturn: z.number().optional(),
  assets: z.array(z.object({
    assetId: z.string().uuid(),
    quantity: z.number().positive(),
    weight: z.number().min(0).max(1),
  })).optional(),
});

const OptimizeSchema = z.object({
  riskTolerance: z.number().min(0).max(1).default(0.5),
  strategy: z.enum(['conservative', 'moderate', 'aggressive']).default('moderate'),
});

export class PortfolioController {
  async getAll(req: Request, res: Response) {
    try {
      const portfolios = await prisma.portfolio.findMany({
        include: {
          assets: { include: { asset: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });
      res.json({ data: portfolios, count: portfolios.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve portfolios' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: req.params.id },
        include: {
          assets: { include: { asset: true } },
          allocations: { orderBy: { timestamp: 'desc' }, take: 10 },
          user: { select: { id: true, name: true, email: true } },
        },
      });
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }
      res.json({ data: portfolio });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve portfolio' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = CreatePortfolioSchema.parse(req.body);
      const portfolio = await prisma.portfolio.create({
        data: {
          name: parsed.name,
          userId: parsed.userId,
          targetReturn: parsed.targetReturn,
          assets: parsed.assets ? {
            create: parsed.assets.map(a => ({
              assetId: a.assetId,
              quantity: a.quantity,
              weight: a.weight,
            })),
          } : undefined,
        },
        include: { assets: { include: { asset: true } } },
      });
      res.status(201).json({ data: portfolio });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create portfolio' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const portfolio = await prisma.portfolio.update({
        where: { id: req.params.id },
        data: req.body,
        include: { assets: { include: { asset: true } } },
      });
      res.json({ data: portfolio });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update portfolio' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      // Delete related records first
      await prisma.allocationLog.deleteMany({ where: { portfolioId: req.params.id } });
      await prisma.portfolioAsset.deleteMany({ where: { portfolioId: req.params.id } });
      await prisma.portfolio.delete({ where: { id: req.params.id } });
      res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete portfolio' });
    }
  }

  async optimize(req: Request, res: Response) {
    try {
      const parsed = OptimizeSchema.parse(req.body);
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: req.params.id },
        include: {
          assets: {
            include: {
              asset: { include: { history: { orderBy: { timestamp: 'desc' }, take: 30 } } }
            }
          }
        },
      });

      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      // Transform to OptimizationService format
      const assetData = portfolio.assets.map(pa => ({
        ticker: pa.asset.ticker,
        historicalReturns: pa.asset.history.length > 1
          ? pa.asset.history.slice(0, -1).map((h, i) => {
              const prev = pa.asset.history[i + 1];
              return (h.price - prev.price) / prev.price;
            })
          : [0.02, 0.01, -0.005, 0.03, 0.015], // Fallback sample data
        volatility: pa.asset.history.length > 1
          ? Math.sqrt(pa.asset.history.reduce((s, h) => s + (h.price ** 2), 0) / pa.asset.history.length)
          : 0.2,
      }));

      const result = OptimizationService.optimizePortfolio(assetData, parsed.riskTolerance);

      // Store previous weights
      const previousWeights = JSON.stringify(
        portfolio.assets.map(pa => ({ ticker: pa.asset.ticker, weight: pa.weight }))
      );

      // Log the allocation decision
      await prisma.allocationLog.create({
        data: {
          portfolioId: portfolio.id,
          decision: JSON.stringify({ strategy: parsed.strategy, riskTolerance: parsed.riskTolerance }),
          previousWeights,
          newWeights: JSON.stringify(result.weights),
          reason: `${result.metrics.decisionLogic} — Sharpe: ${result.metrics.sharpeRatio.toFixed(4)}`,
        },
      });

      // Update portfolio asset weights
      for (const w of result.weights) {
        const pa = portfolio.assets.find(a => a.asset.ticker === w.ticker);
        if (pa) {
          await prisma.portfolioAsset.update({
            where: { id: pa.id },
            data: { weight: w.weight },
          });
        }
      }

      res.json({
        data: {
          optimizedWeights: result.weights,
          metrics: result.metrics,
          strategy: parsed.strategy,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Optimization error:', error);
      res.status(500).json({ error: 'Optimization failed' });
    }
  }

  async riskAnalysis(req: Request, res: Response) {
    try {
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: req.params.id },
        include: {
          assets: {
            include: {
              asset: { include: { history: { orderBy: { timestamp: 'desc' }, take: 30 } } },
            },
          },
        },
      });

      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const analysis = RiskService.analyzePortfolioRisk(
        portfolio.assets.map(pa => ({
          ticker: pa.asset.ticker,
          weight: pa.weight,
          prices: pa.asset.history.map(h => h.price),
          currentPrice: pa.asset.currentPrice,
        }))
      );

      res.json({ data: analysis });
    } catch (error) {
      res.status(500).json({ error: 'Risk analysis failed' });
    }
  }

  async allocationHistory(req: Request, res: Response) {
    try {
      const logs = await prisma.allocationLog.findMany({
        where: { portfolioId: req.params.id },
        orderBy: { timestamp: 'desc' },
        take: 50,
      });
      res.json({ data: logs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve allocation history' });
    }
  }
}
