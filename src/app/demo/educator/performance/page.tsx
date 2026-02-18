'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  Target,
  Award,
  Star,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  description?: string;
}

interface GoalProgress {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
}

const metrics: MetricCard[] = [
  {
    title: 'Total Appointments',
    value: 32,
    change: 12,
    icon: Calendar,
    description: 'This month',
  },
  {
    title: 'Conversion Rate',
    value: '42%',
    change: 5,
    icon: Target,
    description: '14 conversions',
  },
  {
    title: 'Revenue Generated',
    value: '$4,850',
    change: 18,
    icon: DollarSign,
    description: 'This month',
  },
  {
    title: 'Client Satisfaction',
    value: '4.8',
    change: 2,
    icon: Star,
    description: 'Avg rating',
  },
];

const goals: GoalProgress[] = [
  {
    id: '1',
    title: 'Monthly Appointments',
    current: 32,
    target: 40,
    unit: 'appointments',
    deadline: 'End of month',
  },
  {
    id: '2',
    title: 'Conversion Target',
    current: 14,
    target: 20,
    unit: 'conversions',
    deadline: 'End of month',
  },
  {
    id: '3',
    title: 'Revenue Goal',
    current: 4850,
    target: 6000,
    unit: 'USD',
    deadline: 'End of month',
  },
  {
    id: '4',
    title: 'Learning Modules',
    current: 8,
    target: 10,
    unit: 'modules',
    deadline: 'End of quarter',
  },
];

const weeklyData = [
  { day: 'Mon', appointments: 5, conversions: 2 },
  { day: 'Tue', appointments: 7, conversions: 3 },
  { day: 'Wed', appointments: 4, conversions: 1 },
  { day: 'Thu', appointments: 8, conversions: 4 },
  { day: 'Fri', appointments: 6, conversions: 2 },
  { day: 'Sat', appointments: 2, conversions: 1 },
  { day: 'Sun', appointments: 0, conversions: 0 },
];

const recentFeedback = [
  {
    id: '1',
    clientName: 'John Smith',
    rating: 5,
    comment: 'Excellent session! Very knowledgeable and patient in explaining complex concepts.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    clientName: 'Sarah Johnson',
    rating: 5,
    comment: 'Great at breaking down Bitcoin fundamentals. Highly recommend!',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    clientName: 'Michael Brown',
    rating: 4,
    comment: 'Good session overall. Would like more practical examples next time.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export default function PerformancePage() {
  const [period, setPeriod] = useState('month');

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const maxAppointments = Math.max(...weeklyData.map((d) => d.appointments));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Performance</h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                  <p
                    className={`text-xs flex items-center ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(metric.change)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Appointments and conversions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="w-8 text-sm text-muted-foreground">{day.day}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div
                      className="h-6 bg-primary/20 rounded"
                      style={{
                        width: `${(day.appointments / maxAppointments) * 100}%`,
                        minWidth: day.appointments > 0 ? '20px' : '0',
                      }}
                    />
                    <span className="text-sm font-medium">{day.appointments}</span>
                  </div>
                  <div className="w-20 text-right">
                    <Badge variant="secondary" className="text-xs">
                      {day.conversions} conv
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary/20" />
                <span className="text-xs text-muted-foreground">Appointments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Goals Progress</CardTitle>
            <CardDescription>Track your targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.map((goal) => {
              const progress = Math.round((goal.current / goal.target) * 100);
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">{goal.deadline}</p>
                    </div>
                    <span className="text-sm font-medium">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()}{' '}
                      <span className="text-muted-foreground">{goal.unit}</span>
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Client Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>What your clients are saying</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{feedback.clientName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(feedback.date)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= feedback.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Badges and milestones you have earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-yellow-50/50">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Top Performer</p>
                <p className="text-xs text-muted-foreground">Top 10% this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-blue-50/50">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Rising Star</p>
                <p className="text-xs text-muted-foreground">Improved 20% vs last month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-green-50/50">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Client Favorite</p>
                <p className="text-xs text-muted-foreground">4.8+ rating average</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
