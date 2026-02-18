'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TrendingUp, Plus, Calendar, Target, Star, Loader2 } from 'lucide-react';
import { PerformanceMetric } from '@/types';
import { formatDate } from '@/lib/utils';

export default function EducatorPerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const [formData, setFormData] = useState({
    period_start: '',
    period_end: '',
    total_appointments: '',
    conversions: '',
    feedback_score: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('performance_metrics')
          .select('*')
          .eq('educator_id', user.id)
          .order('period_end', { ascending: false });

        if (data) {
          setMetrics(data);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [dialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('performance_metrics').insert({
        educator_id: userId,
        period_start: formData.period_start,
        period_end: formData.period_end,
        total_appointments: parseInt(formData.total_appointments) || 0,
        conversions: parseInt(formData.conversions) || 0,
        feedback_score: formData.feedback_score ? parseFloat(formData.feedback_score) : null,
        notes: formData.notes || null,
      });

      if (!error) {
        setDialogOpen(false);
        setFormData({
          period_start: '',
          period_end: '',
          total_appointments: '',
          conversions: '',
          feedback_score: '',
          notes: '',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Calculate overall stats
  const totalAppointments = metrics.reduce((acc, m) => acc + m.total_appointments, 0);
  const totalConversions = metrics.reduce((acc, m) => acc + m.conversions, 0);
  const overallConversionRate = totalAppointments > 0
    ? (totalConversions / totalAppointments) * 100
    : 0;
  const metricsWithFeedback = metrics.filter((m) => m.feedback_score);
  const avgFeedback = metricsWithFeedback.length
    ? metricsWithFeedback.reduce((acc, m) => acc + (m.feedback_score || 0), 0) /
      metricsWithFeedback.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Performance</h1>
          <p className="text-muted-foreground">
            Track your appointments, conversions, and feedback scores.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Metrics
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Performance Metrics</DialogTitle>
              <DialogDescription>
                Record your performance for a specific period.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period_start">Period Start</Label>
                    <Input
                      id="period_start"
                      type="date"
                      value={formData.period_start}
                      onChange={(e) =>
                        setFormData({ ...formData, period_start: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period_end">Period End</Label>
                    <Input
                      id="period_end"
                      type="date"
                      value={formData.period_end}
                      onChange={(e) =>
                        setFormData({ ...formData, period_end: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_appointments">Total Appointments</Label>
                    <Input
                      id="total_appointments"
                      type="number"
                      min="0"
                      value={formData.total_appointments}
                      onChange={(e) =>
                        setFormData({ ...formData, total_appointments: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conversions">Conversions</Label>
                    <Input
                      id="conversions"
                      type="number"
                      min="0"
                      value={formData.conversions}
                      onChange={(e) =>
                        setFormData({ ...formData, conversions: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback_score">Avg Feedback Score (1-5)</Label>
                  <Input
                    id="feedback_score"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.feedback_score}
                    onChange={(e) =>
                      setFormData({ ...formData, feedback_score: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Total Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConversionRate.toFixed(1)}%</div>
            <Progress value={overallConversionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              Avg Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFeedback.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
          <CardDescription>Your logged performance metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.length > 0 ? (
            <div className="space-y-4">
              {metrics.map((metric) => {
                const rate = metric.total_appointments > 0
                  ? (metric.conversions / metric.total_appointments) * 100
                  : 0;
                return (
                  <div
                    key={metric.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {formatDate(metric.period_start)} - {formatDate(metric.period_end)}
                        </p>
                        {metric.feedback_score && (
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            {metric.feedback_score.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      {metric.notes && (
                        <p className="text-sm text-muted-foreground">{metric.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{rate.toFixed(1)}% conversion</p>
                      <p className="text-sm text-muted-foreground">
                        {metric.conversions}/{metric.total_appointments} appointments
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No performance metrics logged yet.</p>
              <p className="text-sm">Click &quot;Log Metrics&quot; to add your first entry.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
