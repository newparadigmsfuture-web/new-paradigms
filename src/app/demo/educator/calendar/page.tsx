'use client';

import { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  addHours,
  addDays,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Loader2, Trash2, MapPin, Users, UserPlus } from 'lucide-react';

type ClientType = 'regular_customer' | 'potential_be';
type AppointmentType =
  | 'consultation'
  | 'follow_up'
  | 'education_session'
  | 'q_and_a'
  | 'be_interview'
  | 'be_training'
  | 'be_onboarding'
  | 'be_assessment';

interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  client_type: ClientType;
  appointment_type: AppointmentType;
  scheduled_at: Date;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

const STORAGE_KEY = 'demo_appointments';

// Appointment types for regular customers
const customerAppointmentTypes: { value: AppointmentType; label: string }[] = [
  { value: 'consultation', label: 'Initial Consultation' },
  { value: 'follow_up', label: 'Follow-up Session' },
  { value: 'education_session', label: 'Education Session' },
  { value: 'q_and_a', label: 'Q&A Session' },
];

// Appointment types for potential BEs
const potentialBEAppointmentTypes: { value: AppointmentType; label: string }[] = [
  { value: 'be_interview', label: 'BE Interview' },
  { value: 'be_training', label: 'BE Training Session' },
  { value: 'be_onboarding', label: 'BE Onboarding' },
  { value: 'be_assessment', label: 'BE Assessment' },
];

function getAppointmentTypeLabel(type: AppointmentType): string {
  const allTypes = [...customerAppointmentTypes, ...potentialBEAppointmentTypes];
  return allTypes.find(t => t.value === type)?.label || type;
}

function getStoredAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const now = new Date();
    const initial: Appointment[] = [
      {
        id: '1',
        client_name: 'John Smith',
        client_email: 'john@example.com',
        client_phone: '+1 555-0101',
        client_address: '123 Main St, New York, NY 10001',
        client_type: 'regular_customer',
        appointment_type: 'consultation',
        scheduled_at: addHours(now, 2),
        duration_minutes: 60,
        status: 'scheduled',
        notes: 'First consultation about Bitcoin basics',
      },
      {
        id: '2',
        client_name: 'Sarah Johnson',
        client_email: 'sarah@example.com',
        client_phone: '+1 555-0102',
        client_address: '456 Oak Ave, Los Angeles, CA 90001',
        client_type: 'potential_be',
        appointment_type: 'be_interview',
        scheduled_at: addHours(now, 26),
        duration_minutes: 45,
        status: 'scheduled',
        notes: 'Interested in becoming a Bitcoin Educator',
      },
      {
        id: '3',
        client_name: 'Michael Brown',
        client_email: 'michael@example.com',
        client_phone: '+1 555-0103',
        client_address: '789 Pine Rd, Chicago, IL 60601',
        client_type: 'regular_customer',
        appointment_type: 'education_session',
        scheduled_at: addHours(now, 50),
        duration_minutes: 60,
        status: 'scheduled',
        notes: 'Security best practices session',
      },
      {
        id: '4',
        client_name: 'Emily Davis',
        client_email: 'emily@example.com',
        client_phone: '+1 555-0104',
        client_address: '321 Elm Blvd, Miami, FL 33101',
        client_type: 'regular_customer',
        appointment_type: 'q_and_a',
        scheduled_at: addHours(now, 74),
        duration_minutes: 30,
        status: 'scheduled',
        notes: 'Quick Q&A session',
      },
      {
        id: '5',
        client_name: 'David Wilson',
        client_email: 'david@example.com',
        client_phone: '+1 555-0105',
        client_address: '555 Cedar Lane, Austin, TX 78701',
        client_type: 'potential_be',
        appointment_type: 'be_training',
        scheduled_at: addDays(now, 3),
        duration_minutes: 120,
        status: 'scheduled',
        notes: 'BE training - Module 1: Bitcoin Fundamentals',
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  const parsed = JSON.parse(stored);
  return parsed.map((apt: any) => ({
    ...apt,
    scheduled_at: new Date(apt.scheduled_at),
    client_address: apt.client_address || '',
    client_type: apt.client_type || 'regular_customer',
    appointment_type: apt.appointment_type || 'consultation',
  }));
}

function saveAppointments(appointments: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export default function DemoCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    client_type: 'regular_customer' as ClientType,
    appointment_type: 'consultation' as AppointmentType,
    scheduled_at: '',
    duration_minutes: '60',
    notes: '',
    status: 'scheduled',
  });

  useEffect(() => {
    setAppointments(getStoredAppointments());
  }, []);

  // Get appropriate appointment types based on client type
  const availableAppointmentTypes = formData.client_type === 'potential_be'
    ? potentialBEAppointmentTypes
    : customerAppointmentTypes;

  // Reset appointment type when client type changes
  const handleClientTypeChange = (value: ClientType) => {
    const newAppointmentType = value === 'potential_be' ? 'be_interview' : 'consultation';
    setFormData({
      ...formData,
      client_type: value,
      appointment_type: newAppointmentType
    });
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(apt.scheduled_at, day));
  };

  const resetForm = (date?: Date) => {
    setFormData({
      client_name: '',
      client_email: '',
      client_phone: '',
      client_address: '',
      client_type: 'regular_customer',
      appointment_type: 'consultation',
      scheduled_at: format(date || new Date(), "yyyy-MM-dd'T'09:00"),
      duration_minutes: '60',
      notes: '',
      status: 'scheduled',
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
    resetForm(date);
    setDialogOpen(true);
  };

  const handleAppointmentClick = (e: React.MouseEvent, apt: Appointment) => {
    e.stopPropagation();
    setSelectedAppointment(apt);
    setSelectedDate(null);
    setFormData({
      client_name: apt.client_name,
      client_email: apt.client_email,
      client_phone: apt.client_phone,
      client_address: apt.client_address,
      client_type: apt.client_type,
      appointment_type: apt.appointment_type,
      scheduled_at: format(apt.scheduled_at, "yyyy-MM-dd'T'HH:mm"),
      duration_minutes: apt.duration_minutes.toString(),
      notes: apt.notes,
      status: apt.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await new Promise((r) => setTimeout(r, 500));

    const newApt: Appointment = {
      id: selectedAppointment?.id || Date.now().toString(),
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone,
      client_address: formData.client_address,
      client_type: formData.client_type,
      appointment_type: formData.appointment_type,
      scheduled_at: new Date(formData.scheduled_at),
      duration_minutes: parseInt(formData.duration_minutes),
      notes: formData.notes,
      status: formData.status as Appointment['status'],
    };

    let updated: Appointment[];
    if (selectedAppointment) {
      updated = appointments.map((a) => (a.id === newApt.id ? newApt : a));
    } else {
      updated = [...appointments, newApt];
    }

    setAppointments(updated);
    saveAppointments(updated);
    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    const updated = appointments.filter((a) => a.id !== selectedAppointment.id);
    setAppointments(updated);
    saveAppointments(updated);
    setSaving(false);
    setDialogOpen(false);
  };

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'scheduled' && apt.scheduled_at >= new Date())
    .sort((a, b) => a.scheduled_at.getTime() - b.scheduled_at.getTime())
    .slice(0, 5);

  const regularCustomerCount = appointments.filter(a => a.client_type === 'regular_customer' && a.status === 'scheduled').length;
  const potentialBECount = appointments.filter(a => a.client_type === 'potential_be' && a.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your appointments and schedule new sessions.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedAppointment(null);
            setSelectedDate(new Date());
            resetForm(new Date());
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{regularCustomerCount}</p>
              <p className="text-sm text-blue-700">Regular Customers Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{potentialBECount}</p>
              <p className="text-sm text-purple-700">Potential BEs Scheduled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const dayAppointments = getAppointmentsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={idx}
                    className={cn(
                      'min-h-[100px] p-2 border-b border-r cursor-pointer hover:bg-accent/50 transition-colors',
                      !isCurrentMonth && 'bg-muted/30',
                      idx % 7 === 6 && 'border-r-0'
                    )}
                    onClick={() => handleDateSelect(day)}
                  >
                    <div
                      className={cn(
                        'text-sm font-medium mb-1',
                        !isCurrentMonth && 'text-muted-foreground',
                        isToday(day) &&
                          'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center'
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div
                          key={apt.id}
                          className={cn(
                            'text-xs p-1 rounded truncate cursor-pointer',
                            apt.client_type === 'potential_be'
                              ? 'bg-purple-100 text-purple-800 border-l-2 border-purple-500'
                              : 'bg-blue-100 text-blue-800 border-l-2 border-blue-500'
                          )}
                          onClick={(e) => handleAppointmentClick(e, apt)}
                        >
                          {format(apt.scheduled_at, 'HH:mm')} - {apt.client_name}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
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
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors",
                      apt.client_type === 'potential_be' && "border-l-4 border-l-purple-500"
                    )}
                    onClick={() => {
                      setSelectedAppointment(apt);
                      setFormData({
                        client_name: apt.client_name,
                        client_email: apt.client_email,
                        client_phone: apt.client_phone,
                        client_address: apt.client_address,
                        client_type: apt.client_type,
                        appointment_type: apt.appointment_type,
                        scheduled_at: format(apt.scheduled_at, "yyyy-MM-dd'T'HH:mm"),
                        duration_minutes: apt.duration_minutes.toString(),
                        notes: apt.notes,
                        status: apt.status,
                      });
                      setDialogOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{apt.client_name}</p>
                          <Badge
                            variant={apt.client_type === 'potential_be' ? 'default' : 'secondary'}
                            className={cn(
                              "text-xs",
                              apt.client_type === 'potential_be' && "bg-purple-600"
                            )}
                          >
                            {apt.client_type === 'potential_be' ? 'Potential BE' : 'Customer'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(apt.scheduled_at, 'MMM d, h:mm a')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getAppointmentTypeLabel(apt.appointment_type)}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {apt.duration_minutes}m
                      </Badge>
                    </div>
                    {apt.client_address && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{apt.client_address}</span>
                      </div>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment
                ? 'Update the appointment details below.'
                : 'Fill in the details for the new appointment.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Client Type Selection */}
              <div className="space-y-2">
                <Label>Client Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={formData.client_type === 'regular_customer' ? 'default' : 'outline'}
                    className={cn(
                      "justify-start",
                      formData.client_type === 'regular_customer' && "bg-blue-600 hover:bg-blue-700"
                    )}
                    onClick={() => handleClientTypeChange('regular_customer')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Regular Customer
                  </Button>
                  <Button
                    type="button"
                    variant={formData.client_type === 'potential_be' ? 'default' : 'outline'}
                    className={cn(
                      "justify-start",
                      formData.client_type === 'potential_be' && "bg-purple-600 hover:bg-purple-700"
                    )}
                    onClick={() => handleClientTypeChange('potential_be')}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Potential BE
                  </Button>
                </div>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <Label htmlFor="appointment_type">Appointment Type</Label>
                <Select
                  value={formData.appointment_type}
                  onValueChange={(value: AppointmentType) =>
                    setFormData({ ...formData, appointment_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAppointmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Client Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) =>
                      setFormData({ ...formData, client_email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_phone">Client Phone</Label>
                <Input
                  id="client_phone"
                  type="tel"
                  value={formData.client_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, client_phone: e.target.value })
                  }
                />
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="client_address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="client_address"
                    className="pl-9"
                    placeholder="123 Main St, City, State ZIP"
                    value={formData.client_address}
                    onChange={(e) =>
                      setFormData({ ...formData, client_address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Date & Time</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduled_at: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={formData.duration_minutes}
                    onValueChange={(value) =>
                      setFormData({ ...formData, duration_minutes: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedAppointment && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              {selectedAppointment && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedAppointment ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
