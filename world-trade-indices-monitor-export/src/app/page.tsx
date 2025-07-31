"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePolling } from '@/hooks/usePolling';

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdate: string;
  error?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: IndexData[];
  timestamp: string;
  error?: string;
}

export default function MonitoringDashboard() {
  const [indicesData, setIndicesData] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchIndicesData = useCallback(async () => {
    try {
      const response = await fetch('/api/indices');
      const data: ApiResponse = await response.json();

      if (data.success) {
        setIndicesData(data.data);
        setLastUpdate(data.timestamp);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error: Unable to fetch indices data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use the custom polling hook
  usePolling(fetchIndicesData, { delay: 10000 });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const changeStr = change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
    const percentStr = changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;
    return `${changeStr} (${percentStr})`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              World Trade Indices Monitoring
            </h1>
            <p className="text-muted-foreground text-lg">Loading real-time market data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            World Trade Indices Monitoring
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Real-time monitoring of major global stock market indices
          </p>
          {lastUpdate && (
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(lastUpdate).toLocaleString()}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Indices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {indicesData.map((index) => (
            <Card key={index.symbol} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {index.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{index.symbol}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {index.error ? (
                  <div className="text-center py-4">
                    <p className="text-red-500 text-sm">Data unavailable</p>
                  </div>
                ) : (
                  <>
                    {/* Current Price */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {formatPrice(index.price)}
                      </p>
                      <p className="text-sm text-muted-foreground">{index.currency}</p>
                    </div>

                    {/* Price Change */}
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${getChangeColor(index.change)}`}>
                        {formatChange(index.change, index.changePercent)}
                      </p>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="mt-4">
                      <img
                        src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/363ccffb-472c-4797-93aa-f53f89edeab6.png)}+showing+real-time+market+movements`}
                        alt={`Live trend chart displaying real-time ${index.name} market movements and price trends`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Last Update */}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(index.lastUpdate).toLocaleTimeString()}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 text-sm font-medium">Live Data Feed Active</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-muted-foreground text-sm">
          <p>Data refreshes every 10 seconds • Market data may be delayed</p>
          <p className="mt-2">Built with Next.js and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
