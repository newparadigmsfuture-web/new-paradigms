import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateInsight, AIProvider } from '@/lib/ai/provider';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data, context, provider = 'openai' } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }

    const validTypes = ['performance_analysis', 'recommendations', 'summary', 'anomaly_detection'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid insight type' },
        { status: 400 }
      );
    }

    const validProviders: AIProvider[] = ['openai', 'anthropic'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid AI provider' },
        { status: 400 }
      );
    }

    const insight = await generateInsight(
      { type, data, context },
      provider as AIProvider
    );

    return NextResponse.json({
      success: true,
      insight: insight.content,
      provider: insight.provider,
    });
  } catch (error: any) {
    console.error('AI Insights Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate insight' },
      { status: 500 }
    );
  }
}
