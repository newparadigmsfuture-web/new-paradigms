import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  TrendingUp,
  Calendar,
  Brain,
  ArrowRight,
  UserPlus,
  BarChart3,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch user counts by role
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: educatorCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'educator');

  const { count: trainerCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'trainer');

  // Fetch total appointments
  const { count: totalAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true });

  const { count: completedAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  // Fetch recent users
  const { data: recentUsers } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch performance metrics for company-wide stats
  const { data: allMetrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  // Calculate company-wide stats
  const totalConversions = allMetrics?.reduce((acc, m) => acc + m.conversions, 0) || 0;
  const totalMetricAppointments = allMetrics?.reduce((acc, m) => acc + m.total_appointments, 0) || 0;
  const companyConversionRate = totalMetricAppointments > 0
    ? (totalConversions / totalMetricAppointments) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Complete overview of New Paradigms operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/insights">
              <Brain className="mr-2 h-4 w-4" />
              AI Insights
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/users">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={totalUsers || 0}
          description={`${educatorCount} educators, ${trainerCount} trainers`}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Appointments"
          value={totalAppointments || 0}
          description={`${completedAppointments} completed`}
          icon={Calendar}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${companyConversionRate.toFixed(1)}%`}
          description="Company average"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Total Conversions"
          value={totalConversions}
          description="All time"
          icon={BarChart3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>Performance by role</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics">
                View analytics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Bitcoin Educators</span>
                  <span className="text-muted-foreground">{educatorCount} members</span>
                </div>
                <Progress value={((educatorCount || 0) / (totalUsers || 1)) * 100} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Trainers</span>
                  <span className="text-muted-foreground">{trainerCount} members</span>
                </div>
                <Progress value={((trainerCount || 0) / (totalUsers || 1)) * 100} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Appointment Completion</span>
                  <span className="text-muted-foreground">
                    {completedAppointments}/{totalAppointments}
                  </span>
                </div>
                <Progress
                  value={((completedAppointments || 0) / Math.max(totalAppointments || 1, 1)) * 100}
                  className="h-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/insights">
                <Brain className="mr-2 h-4 w-4" />
                AI Insights
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/resources">
                <FileText className="mr-2 h-4 w-4" />
                Manage Resources
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Newly registered team members</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/users/${user.id}`}>Manage</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
