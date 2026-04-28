import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function main() {
  console.log('🌱 Starting global seed process...');

  // 1. Seed Assets & Price History
  for (const asset of SEED_ASSETS) {
    const newAsset = await prisma.asset.upsert({
      where: { ticker: asset.ticker },
      update: { currentPrice: asset.currentPrice },
      create: asset,
    });

    // Check if history exists
    const historyCount = await prisma.priceHistory.count({ where: { assetId: newAsset.id } });
    if (historyCount === 0) {
      const priceRecords = [];
      let price = asset.currentPrice;
      for (let i = 29; i >= 0; i--) {
        const dailyReturn = (Math.random() - 0.48) * 0.04;
        price = price * (1 + dailyReturn);
        priceRecords.push({
          assetId: newAsset.id,
          price: parseFloat(price.toFixed(2)),
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        });
      }
      await prisma.priceHistory.createMany({ data: priceRecords });
    }
  }
  console.log('✅ Assets and price history seeded.');

  // 2. Seed Demo User
  const user = await prisma.user.upsert({
    where: { email: 'sam.semlali@quantis.capital' },
    update: {},
    create: {
      email: 'sam.semlali@quantis.capital',
      name: 'Sam Semlali',
    },
  });
  console.log('✅ User "Sam Semlali" ready.');

  // 3. Seed Institutional Portfolio
  const existingPortfolio = await prisma.portfolio.findFirst({
    where: { userId: user.id, name: 'Institutional Growth Alpha' }
  });

  if (!existingPortfolio) {
    const assets = await prisma.asset.findMany();
    await prisma.portfolio.create({
      data: {
        name: 'Institutional Growth Alpha',
        userId: user.id,
        targetReturn: 0.12,
        assets: {
          create: [
            { assetId: assets.find(a => a.ticker === 'AAPL')?.id!, quantity: 100, weight: 0.25 },
            { assetId: assets.find(a => a.ticker === 'BTC')?.id!, quantity: 0.5, weight: 0.20 },
            { assetId: assets.find(a => a.ticker === 'NVDA')?.id!, quantity: 50, weight: 0.15 },
            { assetId: assets.find(a => a.ticker === 'GLD')?.id!, quantity: 200, weight: 0.15 },
            { assetId: assets.find(a => a.ticker === 'AGG')?.id!, quantity: 500, weight: 0.10 },
            { assetId: assets.find(a => a.ticker === 'SPY')?.id!, quantity: 150, weight: 0.15 },
          ],
        },
      },
    });
    console.log('✅ Institutional Portfolio created.');
  } else {
    console.log('ℹ️ Portfolio already exists, skipping creation.');
  }

  console.log('🚀 Seed process complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
