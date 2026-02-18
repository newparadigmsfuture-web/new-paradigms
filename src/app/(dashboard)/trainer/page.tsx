import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

export default async function TrainerDashboard() {
  const supabase = await createClient();

  // Fetch all educators (team members)
  const { data: educators, count: educatorCount } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('role', 'educator')
    .limit(5);

  // Fetch training resources count
  const { count: resourceCount } = await supabase
    .from('training_resources')
    .select('*', { count: 'exact', head: true });

  // Fetch recent performance metrics across all educators
  const { data: allMetrics } = await supabase
    .from('performance_metrics')
    .select('*, educator:users(*)')
    .order('created_at', { ascending: false })
    .limit(10);

  // Calculate average conversion rate
  const avgConversion = allMetrics?.length
    ? allMetrics.reduce((acc, m) => {
        const rate = m.total_appointments > 0
          ? (m.conversions / m.total_appointments) * 100
          : 0;
        return acc + rate;
      }, 0) / allMetrics.length
    : 0;

  // Calculate average feedback score
  const metricsWithFeedback = allMetrics?.filter((m) => m.feedback_score) || [];
  const avgFeedback = metricsWithFeedback.length
    ? metricsWithFeedback.reduce((acc, m) => acc + (m.feedback_score || 0), 0) /
      metricsWithFeedback.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your team&apos;s performance and manage training content.
          </p>
        </div>
        <Button asChild>
          <Link href="/trainer/content">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Team Size"
          value={educatorCount || 0}
          description="Active educators"
          icon={Users}
        />
        <StatsCard
          title="Training Resources"
          value={resourceCount || 0}
          description="Available materials"
          icon={FileText}
        />
        <StatsCard
          title="Avg. Conversion"
          value={`${avgConversion.toFixed(1)}%`}
          description="Team average"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Avg. Feedback"
          value={avgFeedback.toFixed(1)}
          description="Out of 5.0"
          icon={Star}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Your Bitcoin Educators</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/trainer/team">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {educators && educators.length > 0 ? (
              <div className="space-y-4">
                {educators.map((educator) => (
                  <div
                    key={educator.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={educator.avatar_url || undefined} />
                        <AvatarFallback>
                          {getInitials(educator.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{educator.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {educator.email}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/trainer/team/${educator.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No team members yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Recent metrics from your team</CardDescription>
          </CardHeader>
          <CardContent>
            {allMetrics && allMetrics.length > 0 ? (
              <div className="space-y-4">
                {allMetrics.slice(0, 4).map((metric) => {
                  const convRate = metric.total_appointments > 0
                    ? (metric.conversions / metric.total_appointments) * 100
                    : 0;
                  return (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {(metric.educator as any)?.full_name || 'Unknown'}
                        </span>
                        <span className="text-muted-foreground">
                          {convRate.toFixed(0)}% conversion
                        </span>
                      </div>
                      <Progress value={convRate} className="h-2" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No performance data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Training Schedule</CardTitle>
            <CardDescription>Upcoming training sessions</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/trainer/schedule">
              Manage schedule
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming training sessions</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/trainer/schedule">Schedule a session</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
