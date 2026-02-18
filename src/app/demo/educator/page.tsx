'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  MessageSquare,
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
}

function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function DemoEducatorDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Demo appointments
  const appointments = [
    {
      id: '1',
      client_name: 'John Smith',
      scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration_minutes: 60,
      status: 'scheduled',
    },
    {
      id: '2',
      client_name: 'Sarah Johnson',
      scheduled_at: new Date(Date.now() + 26 * 60 * 60 * 1000),
      duration_minutes: 45,
      status: 'scheduled',
    },
    {
      id: '3',
      client_name: 'Michael Brown',
      scheduled_at: new Date(Date.now() + 50 * 60 * 60 * 1000),
      duration_minutes: 60,
      status: 'scheduled',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your education sessions today.
          </p>
        </div>
        <Button asChild>
          <Link href="/demo/educator/calendar">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Appointments"
          value={24}
          description="This month"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Conversion Rate"
          value="42%"
          description="8 conversions"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Feedback Score"
          value="4.8"
          description="Average rating"
          icon={Users}
        />
        <StatsCard
          title="Unread Messages"
          value={3}
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
              <Link href="/demo/educator/calendar">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/demo/educator/calendar">
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/demo/educator/performance">
                <TrendingUp className="mr-2 h-4 w-4" />
                Log Performance Metrics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/demo/educator/resources">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                View Training Resources
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/demo/educator/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Trainer
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
