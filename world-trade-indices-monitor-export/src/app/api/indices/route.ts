import { NextResponse } from 'next/server';

// Define the major world trade indices with base values
const INDICES = [
  { symbol: '^GSPC', name: 'S&P 500', basePrice: 5800.00, currency: 'USD' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', basePrice: 42500.00, currency: 'USD' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', basePrice: 18200.00, currency: 'USD' },
  { symbol: '^FTSE', name: 'FTSE 100', basePrice: 8100.00, currency: 'GBP' },
  { symbol: '^N225', name: 'Nikkei 225', basePrice: 39800.00, currency: 'JPY' },
  { symbol: '^GDAXI', name: 'DAX', basePrice: 19500.00, currency: 'EUR' },
  { symbol: '^HSI', name: 'Hang Seng Index', basePrice: 19200.00, currency: 'HKD' },
  { symbol: '^AXJO', name: 'ASX 200', basePrice: 8300.00, currency: 'AUD' }
];

// Generate realistic market data with small random fluctuations
function generateMarketData(basePrice: number) {
  // Generate a random change between -2% and +2%
  const changePercent = (Math.random() - 0.5) * 4;
  const change = (basePrice * changePercent) / 100;
  const currentPrice = basePrice + change;
  
  return {
    price: Math.round(currentPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100
  };
}

export async function GET() {
  try {
    // First, try to fetch real data from Yahoo Finance
    const fetchPromises = INDICES.map(async (index) => {
      try {
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(index.symbol)}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(3000)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const quote = data.quoteResponse?.result?.[0];

        if (!quote || !quote.regularMarketPrice) {
          throw new Error('No valid data');
        }

        return {
          symbol: index.symbol,
          name: index.name,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange || 0,
          changePercent: quote.regularMarketChangePercent || 0,
          currency: quote.currency || index.currency,
          lastUpdate: quote.regularMarketTime ? new Date(quote.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
          isRealData: true
        };
      } catch {
        // Fallback to simulated data
        const marketData = generateMarketData(index.basePrice);
        
        return {
          symbol: index.symbol,
          name: index.name,
          price: marketData.price,
          change: marketData.change,
          changePercent: marketData.changePercent,
          currency: index.currency,
          lastUpdate: new Date().toISOString(),
          isRealData: false
        };
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
      note: results.some(r => !r.isRealData) ? 'Some data is simulated due to API limitations' : 'All data is real-time'
    });

  } catch (err) {
    console.error('Error in indices API:', err);
    
    // Complete fallback - return all simulated data
    const fallbackData = INDICES.map(index => {
      const marketData = generateMarketData(index.basePrice);
      
      return {
        symbol: index.symbol,
        name: index.name,
        price: marketData.price,
        change: marketData.change,
        changePercent: marketData.changePercent,
        currency: index.currency,
        lastUpdate: new Date().toISOString(),
        isRealData: false
      };
    });

    return NextResponse.json({
      success: true,
      data: fallbackData,
      timestamp: new Date().toISOString(),
      note: 'All data is simulated due to API limitations'
    });
  }
}
