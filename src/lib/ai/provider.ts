import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export type AIProvider = 'openai' | 'anthropic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIInsightRequest {
  type: 'performance_analysis' | 'recommendations' | 'summary' | 'anomaly_detection';
  data: Record<string, any>;
  context?: string;
}

export interface AIInsightResponse {
  content: string;
  provider: AIProvider;
}

export async function generateInsight(
  request: AIInsightRequest,
  provider: AIProvider = 'openai'
): Promise<AIInsightResponse> {
  const systemPrompt = getSystemPrompt(request.type);
  const userPrompt = formatUserPrompt(request);

  if (provider === 'anthropic') {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    return {
      content: textContent?.type === 'text' ? textContent.text : '',
      provider: 'anthropic',
    };
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 1024,
  });

  return {
    content: response.choices[0]?.message?.content || '',
    provider: 'openai',
  };
}

function getSystemPrompt(type: AIInsightRequest['type']): string {
  const prompts = {
    performance_analysis: `You are an expert performance analyst for a Bitcoin education company.
Analyze the provided performance metrics and give actionable insights.
Focus on trends, areas of improvement, and notable achievements.
Be concise and specific with your analysis.`,

    recommendations: `You are a professional development coach for Bitcoin educators.
Based on the provided data, give specific, actionable recommendations to improve performance.
Focus on practical steps that can be implemented immediately.
Keep recommendations prioritized and realistic.`,

    summary: `You are a business intelligence analyst for a Bitcoin education company.
Summarize the provided data into key insights and takeaways.
Highlight the most important metrics and trends.
Be clear and executive-friendly in your summary.`,

    anomaly_detection: `You are a data analyst specializing in performance metrics.
Identify any anomalies, outliers, or unusual patterns in the provided data.
Explain what these anomalies might indicate and recommend follow-up actions.
Be specific about what makes each finding unusual.`,
  };

  return prompts[type];
}

function formatUserPrompt(request: AIInsightRequest): string {
  let prompt = `Please analyze the following data:\n\n`;
  prompt += JSON.stringify(request.data, null, 2);

  if (request.context) {
    prompt += `\n\nAdditional context: ${request.context}`;
  }

  return prompt;
}

export async function generatePerformanceReport(
  metrics: any[],
  provider: AIProvider = 'openai'
): Promise<string> {
  const response = await generateInsight(
    {
      type: 'summary',
      data: { metrics },
      context: 'Generate a comprehensive performance report for the management team.',
    },
    provider
  );

  return response.content;
}

export async function getImprovementRecommendations(
  educatorMetrics: any,
  provider: AIProvider = 'openai'
): Promise<string> {
  const response = await generateInsight(
    {
      type: 'recommendations',
      data: educatorMetrics,
      context: 'Provide specific recommendations to help this Bitcoin Educator improve their conversion rate and client satisfaction.',
    },
    provider
  );

  return response.content;
}
