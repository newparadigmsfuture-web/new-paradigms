import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const educatorId = searchParams.get('educator_id');
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let query = supabase.from('appointments').select('*, educator:users(*)');

    if (educatorId) {
      query = query.eq('educator_id', educatorId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (from) {
      query = query.gte('scheduled_at', from);
    }

    if (to) {
      query = query.lte('scheduled_at', to);
    }

    const { data, error } = await query.order('scheduled_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointments: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const {
      client_name,
      client_email,
      client_phone,
      scheduled_at,
      duration_minutes = 60,
      notes,
    } = body;

    if (!client_name || !client_email || !scheduled_at) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        educator_id: user.id,
        client_name,
        client_email,
        client_phone: client_phone || null,
        scheduled_at,
        duration_minutes,
        notes: notes || null,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointment: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
