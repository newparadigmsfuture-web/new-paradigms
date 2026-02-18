import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  TrendingUp,
  Users,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';

export default async function EducatorDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch upcoming appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('educator_id', user?.id)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(5);

  // Fetch recent performance metrics
  const { data: metrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('educator_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Fetch unread messages count
  const { count: unreadCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user?.id)
    .is('read_at', null);

  const conversionRate = metrics
    ? Math.round((metrics.conversions / Math.max(metrics.total_appointments, 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your education sessions today.
          </p>
        </div>
        <Button asChild>
          <Link href="/educator/calendar">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Appointments"
          value={metrics?.total_appointments || 0}
          description="This period"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          description={`${metrics?.conversions || 0} conversions`}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Feedback Score"
          value={metrics?.feedback_score?.toFixed(1) || 'N/A'}
          description="Average rating"
          icon={Users}
        />
        <StatsCard
          title="Unread Messages"
          value={unreadCount || 0}
          description="New messages"
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your next scheduled sessions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/educator/calendar">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(appointment.scheduled_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {appointment.duration_minutes} min
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/educator/calendar">Schedule one now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/educator/calendar">
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/educator/performance">
                <TrendingUp className="mr-2 h-4 w-4" />
                Log Performance Metrics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/educator/resources">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                View Training Resources
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/educator/messages">
                <AlertCircle className="mr-2 h-4 w-4" />
                Message Trainer
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
