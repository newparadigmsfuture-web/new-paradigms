'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CalendarView } from '@/components/calendar/calendar-view';
import { AppointmentDialog } from '@/components/calendar/appointment-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock } from 'lucide-react';
import { Appointment } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function EducatorCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data } = await supabase
          .from('appointments')
          .select('*')
          .eq('educator_id', user.id)
          .order('scheduled_at', { ascending: true });

        if (data) {
          setAppointments(data);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [dialogOpen]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
    setDialogOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate(null);
    setDialogOpen(true);
  };

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'scheduled' && new Date(apt.scheduled_at) >= new Date())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your appointments and schedule new sessions.
          </p>
        </div>
        <Button onClick={() => {
          setSelectedAppointment(null);
          setSelectedDate(new Date());
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarView
            appointments={appointments}
            onDateSelect={handleDateSelect}
            onAppointmentClick={handleAppointmentClick}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming
            </CardTitle>
            <CardDescription>Your next appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleAppointmentClick(apt)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{apt.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(apt.scheduled_at)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {apt.duration_minutes}m
                      </Badge>
                    </div>
                    {apt.notes && (
                      <p className="text-sm text-muted-foreground mt-2 truncate">
                        {apt.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={selectedAppointment}
        selectedDate={selectedDate || undefined}
        educatorId={userId}
      />
    </div>
  );
}
