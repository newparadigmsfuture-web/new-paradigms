'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Brain, TrendingUp, AlertTriangle, FileText, Loader2, Sparkles } from 'lucide-react';

type InsightType = 'performance_analysis' | 'recommendations' | 'summary' | 'anomaly_detection';
type AIProvider = 'openai' | 'anthropic';

interface GeneratedInsight {
  type: InsightType;
  content: string;
  provider: AIProvider;
  timestamp: Date;
}

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [insights, setInsights] = useState<GeneratedInsight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async (type: InsightType) => {
    setLoading(true);
    setError(null);

    try {
      // Mock data for demonstration - in production, fetch real data
      const mockData = {
        performance_analysis: {
          total_educators: 25,
          total_appointments: 450,
          completed_appointments: 380,
          average_conversion_rate: 42,
          average_feedback_score: 4.2,
          top_performers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
          improvement_needed: ['Alex Brown', 'Sarah Wilson'],
        },
        recommendations: {
          educator_name: 'Sample Educator',
          conversion_rate: 35,
          feedback_score: 3.8,
          total_appointments: 45,
          common_client_concerns: ['Volatility', 'Security', 'Getting started'],
        },
        summary: {
          period: 'Last 30 days',
          key_metrics: {
            new_clients: 120,
            retained_clients: 85,
            total_revenue_potential: '$45,000',
            team_growth: '+3 educators',
          },
        },
        anomaly_detection: {
          metrics_by_week: [
            { week: 1, appointments: 95, conversions: 40 },
            { week: 2, appointments: 110, conversions: 48 },
            { week: 3, appointments: 85, conversions: 32 },
            { week: 4, appointments: 160, conversions: 72 },
          ],
          educator_metrics: [
            { name: 'Educator A', rate: 45 },
            { name: 'Educator B', rate: 42 },
            { name: 'Educator C', rate: 12 },
            { name: 'Educator D', rate: 48 },
          ],
        },
      };

      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data: mockData[type],
          provider,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate insight');
      }

      setInsights((prev) => [
        {
          type,
          content: result.insight,
          provider: result.provider,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate insight');
    } finally {
      setLoading(false);
    }
  };

  const insightTypes = [
    {
      type: 'performance_analysis' as InsightType,
      label: 'Performance Analysis',
      description: 'Analyze team performance trends and patterns',
      icon: TrendingUp,
    },
    {
      type: 'recommendations' as InsightType,
      label: 'Recommendations',
      description: 'Get actionable improvement suggestions',
      icon: Sparkles,
    },
    {
      type: 'summary' as InsightType,
      label: 'Executive Summary',
      description: 'Generate a high-level business summary',
      icon: FileText,
    },
    {
      type: 'anomaly_detection' as InsightType,
      label: 'Anomaly Detection',
      description: 'Identify unusual patterns in data',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Insights
          </h1>
          <p className="text-muted-foreground">
            Get AI-powered analysis and recommendations for your team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">AI Provider:</span>
          <Select value={provider} onValueChange={(v: AIProvider) => setProvider(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
              <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insightTypes.map((insight) => (
          <Card key={insight.type} className="hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <insight.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{insight.label}</CardTitle>
              </div>
              <CardDescription>{insight.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => generateInsight(insight.type)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Insights</CardTitle>
          <CardDescription>
            Your AI-generated analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length > 0 ? (
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="mb-4">
                {insights.slice(0, 5).map((_, idx) => (
                  <TabsTrigger key={idx} value={idx.toString()}>
                    Insight {idx + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {insights.slice(0, 5).map((insight, idx) => (
                <TabsContent key={idx} value={idx.toString()}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {insight.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {insight.provider === 'openai' ? 'GPT-4' : 'Claude'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {insight.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                        {insight.content}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No insights generated yet.</p>
              <p className="text-sm">Click one of the buttons above to generate AI insights.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
