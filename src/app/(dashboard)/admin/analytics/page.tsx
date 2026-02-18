import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { MetricsChart } from '@/components/analytics/metrics-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Calendar, Target } from 'lucide-react';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  // Fetch aggregate data
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: totalAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true });

  const { count: completedAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { data: allMetrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .order('period_end', { ascending: true });

  // Calculate totals
  const totalConversions = allMetrics?.reduce((acc, m) => acc + m.conversions, 0) || 0;
  const totalMetricAppointments =
    allMetrics?.reduce((acc, m) => acc + m.total_appointments, 0) || 0;
  const avgConversionRate =
    totalMetricAppointments > 0
      ? (totalConversions / totalMetricAppointments) * 100
      : 0;

  // Prepare chart data (mock monthly data for visualization)
  const monthlyData = [
    { name: 'Jan', appointments: 45, conversions: 18, rate: 40 },
    { name: 'Feb', appointments: 52, conversions: 23, rate: 44 },
    { name: 'Mar', appointments: 48, conversions: 19, rate: 40 },
    { name: 'Apr', appointments: 61, conversions: 28, rate: 46 },
    { name: 'May', appointments: 55, conversions: 24, rate: 44 },
    { name: 'Jun', appointments: 67, conversions: 32, rate: 48 },
  ];

  const teamPerformance = [
    { name: 'Team A', appointments: 120, conversions: 52 },
    { name: 'Team B', appointments: 95, conversions: 38 },
    { name: 'Team C', appointments: 110, conversions: 48 },
    { name: 'Team D', appointments: 88, conversions: 35 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and performance insights.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={totalUsers || 0}
          description="Registered users"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Appointments"
          value={totalAppointments || 0}
          description={`${completedAppointments} completed`}
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${avgConversionRate.toFixed(1)}%`}
          description="Overall average"
          icon={Target}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Total Conversions"
          value={totalConversions}
          description="All time"
          icon={TrendingUp}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="team">Team Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <MetricsChart
              title="Monthly Appointments"
              description="Number of appointments over time"
              data={monthlyData}
              type="bar"
              dataKeys={[
                { key: 'appointments', color: 'hsl(var(--primary))', name: 'Appointments' },
              ]}
            />
            <MetricsChart
              title="Conversion Trend"
              description="Conversion rate percentage over time"
              data={monthlyData}
              type="line"
              dataKeys={[
                { key: 'rate', color: 'hsl(142, 76%, 36%)', name: 'Conversion Rate %' },
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6 space-y-6">
          <MetricsChart
            title="Appointments vs Conversions"
            description="Monthly comparison of appointments and successful conversions"
            data={monthlyData}
            type="bar"
            dataKeys={[
              { key: 'appointments', color: 'hsl(var(--primary))', name: 'Appointments' },
              { key: 'conversions', color: 'hsl(142, 76%, 36%)', name: 'Conversions' },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Summary</CardTitle>
              <CardDescription>
                Aggregated performance data from all educators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold">{totalMetricAppointments}</p>
                  <p className="text-sm text-muted-foreground">Total Tracked Appointments</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold">{totalConversions}</p>
                  <p className="text-sm text-muted-foreground">Total Conversions</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold">{avgConversionRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Average Conversion Rate</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold">{allMetrics?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Metric Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6 space-y-6">
          <MetricsChart
            title="Team Performance Comparison"
            description="Appointments and conversions by team"
            data={teamPerformance}
            type="bar"
            dataKeys={[
              { key: 'appointments', color: 'hsl(var(--primary))', name: 'Appointments' },
              { key: 'conversions', color: 'hsl(142, 76%, 36%)', name: 'Conversions' },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
