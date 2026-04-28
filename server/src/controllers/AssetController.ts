import { Request, Response } from 'express';
import { prisma } from '../index';
import { z } from 'zod';

const CreateAssetSchema = z.object({
  ticker: z.string().min(1).max(10),
  name: z.string().min(1),
  type: z.enum(['STOCK', 'CRYPTO', 'COMMODITY', 'BOND', 'ETF']),
  currentPrice: z.number().positive(),
});

// Sample market data for seeding
const SEED_ASSETS = [
  { ticker: 'AAPL', name: 'Apple Inc.', type: 'STOCK', currentPrice: 189.20 },
  { ticker: 'NVDA', name: 'Nvidia Corporation', type: 'STOCK', currentPrice: 890.45 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', type: 'STOCK', currentPrice: 415.80 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'STOCK', currentPrice: 175.30 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', type: 'STOCK', currentPrice: 185.60 },
  { ticker: 'BTC', name: 'Bitcoin', type: 'CRYPTO', currentPrice: 64200.10 },
  { ticker: 'ETH', name: 'Ethereum', type: 'CRYPTO', currentPrice: 3240.50 },
  { ticker: 'SOL', name: 'Solana', type: 'CRYPTO', currentPrice: 142.80 },
  { ticker: 'GLD', name: 'SPDR Gold Shares', type: 'COMMODITY', currentPrice: 215.40 },
  { ticker: 'AGG', name: 'iShares Core US Aggregate Bond', type: 'BOND', currentPrice: 98.50 },
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', currentPrice: 510.25 },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', currentPrice: 440.10 },
];

export class AssetController {
  async getAll(req: Request, res: Response) {
    try {
      const { type } = req.query;
      const assets = await prisma.asset.findMany({
        where: type ? { type: String(type) } : undefined,
        orderBy: { ticker: 'asc' },
      });
      res.json({ data: assets, count: assets.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve assets' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const asset = await prisma.asset.findUnique({
        where: { id: req.params.id },
        include: { history: { orderBy: { timestamp: 'desc' }, take: 90 } },
      });
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json({ data: asset });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve asset' });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const assets = await prisma.asset.findMany({
        where: {
          OR: [
            { ticker: { contains: String(q).toUpperCase() } },
            { name: { contains: String(q), mode: 'insensitive' } },
          ],
        },
        take: 20,
      });
      res.json({ data: assets });
    } catch (error) {
      res.status(500).json({ error: 'Search failed' });
    }
  }

  async getPriceHistory(req: Request, res: Response) {
    try {
      const history = await prisma.priceHistory.findMany({
        where: { assetId: req.params.id },
        orderBy: { timestamp: 'desc' },
        take: Number(req.query.limit) || 30,
      });
      res.json({ data: history });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve price history' });
    }
  }

  async seedMarketData(req: Request, res: Response) {
    try {
      let created = 0;
      for (const asset of SEED_ASSETS) {
        const existing = await prisma.asset.findUnique({ where: { ticker: asset.ticker } });
        if (!existing) {
          const newAsset = await prisma.asset.create({ data: asset });
          // Generate 30 days of synthetic price history
          const priceRecords = [];
          let price = asset.currentPrice;
          for (let i = 29; i >= 0; i--) {
            const dailyReturn = (Math.random() - 0.48) * 0.04; // Slight upward bias
            price = price * (1 + dailyReturn);
            priceRecords.push({
              assetId: newAsset.id,
              price: parseFloat(price.toFixed(2)),
              timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            });
          }
          await prisma.priceHistory.createMany({ data: priceRecords });
          created++;
        }
      }
      res.json({ message: `Seeded ${created} new assets with price history`, total: SEED_ASSETS.length });
    } catch (error) {
      console.error('Seed error:', error);
      res.status(500).json({ error: 'Failed to seed market data' });
    }
  }
}
