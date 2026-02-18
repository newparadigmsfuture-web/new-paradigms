'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  isBefore,
  addDays,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  GraduationCap,
  Star,
  Video,
} from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingStep {
  step: number;
  title: string;
}

const steps: BookingStep[] = [
  { step: 1, title: 'Select Date & Time' },
  { step: 2, title: 'Your Information' },
  { step: 3, title: 'Confirmation' },
];

const sessionTypes = [
  {
    id: 'consultation',
    name: 'Initial Consultation',
    duration: 30,
    price: 0,
    description: 'Free 30-minute consultation to discuss your Bitcoin education needs',
  },
  {
    id: 'education',
    name: 'Bitcoin Education Session',
    duration: 60,
    price: 150,
    description: 'One-on-one education session covering Bitcoin fundamentals',
  },
  {
    id: 'advanced',
    name: 'Advanced Training',
    duration: 90,
    price: 225,
    description: 'Deep dive into advanced Bitcoin concepts and strategies',
  },
];

function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let hour = 9; hour <= 17; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 17 && minute === 30) continue;

      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);

      // Mark some slots as unavailable (simulating booked slots)
      const isBooked = Math.random() > 0.7;
      const isPast = isBefore(slotTime, now);

      slots.push({
        time: format(slotTime, 'h:mm a'),
        available: !isBooked && !isPast,
      });
    }
  }
  return slots;
}

export default function PublicBookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState(sessionTypes[0]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, new Date()) && !isToday(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setTimeSlots(generateTimeSlots(date));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const formatCurrency = (value: number) =>
    value === 0 ? 'Free' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your session has been scheduled. You will receive a confirmation email shortly.
            </p>
            <div className="bg-muted p-4 rounded-lg text-left mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session:</span>
                  <span className="font-medium">{selectedSessionType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{selectedSessionType.duration} minutes</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Video className="h-4 w-4" />
              <span>A video conference link will be sent to your email</span>
            </div>
            <Button asChild className="w-full">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="font-bold text-lg">New Paradigms</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.9 rating (127 reviews)</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center font-medium',
                  currentStep >= step.step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {step.step}
              </div>
              <span
                className={cn(
                  'ml-2 text-sm',
                  currentStep >= step.step ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-16 h-0.5 mx-4',
                    currentStep > step.step ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Session Type Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Session Type</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sessionTypes.map((type) => (
                      <div
                        key={type.id}
                        className={cn(
                          'p-4 rounded-lg border cursor-pointer transition-colors',
                          selectedSessionType.id === type.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted'
                        )}
                        onClick={() => setSelectedSessionType(type)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {type.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {type.duration} min
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={type.price === 0 ? 'secondary' : 'default'}
                            className={type.price === 0 ? 'bg-green-100 text-green-700' : ''}
                          >
                            {formatCurrency(type.price)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Calendar */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Select Date</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-medium min-w-32 text-center">
                          {format(currentMonth, 'MMMM yyyy')}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-muted-foreground py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((day, i) => {
                        const isPast = isBefore(day, new Date()) && !isToday(day);
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                        const isDisabled = isPast || isWeekend || !isSameMonth(day, currentMonth);

                        return (
                          <button
                            key={i}
                            onClick={() => !isDisabled && handleDateSelect(day)}
                            disabled={isDisabled}
                            className={cn(
                              'aspect-square p-2 text-sm rounded-lg transition-colors',
                              !isSameMonth(day, currentMonth) && 'text-muted-foreground/30',
                              isSameMonth(day, currentMonth) &&
                                !isDisabled &&
                                'hover:bg-muted cursor-pointer',
                              isToday(day) && 'font-bold',
                              selectedDate &&
                                isSameDay(day, selectedDate) &&
                                'bg-primary text-primary-foreground hover:bg-primary',
                              isDisabled && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            {format(day, 'd')}
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Time Slots */}
                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Time</CardTitle>
                      <CardDescription>
                        Available times for {format(selectedDate, 'MMMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? 'default' : 'outline'}
                            disabled={!slot.available}
                            onClick={() => handleTimeSelect(slot.time)}
                            className="w-full"
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>
                    Please provide your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any specific topics you'd like to discuss..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!formData.name || !formData.email}
                    >
                      Review Booking
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Your Booking</CardTitle>
                  <CardDescription>
                    Please review your booking details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3">Session Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{selectedSessionType.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{selectedSessionType.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{selectedDate && format(selectedDate, 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span>{selectedTime}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-primary">
                            {formatCurrency(selectedSessionType.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3">Your Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span>{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{formData.email}</span>
                        </div>
                        {formData.phone && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span>{formData.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {formData.notes && (
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm text-muted-foreground">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDate
                          ? format(selectedDate, 'EEEE, MMMM d, yyyy')
                          : 'Not selected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTime || 'Not selected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Session Type</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedSessionType.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedSessionType.duration} minutes
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(selectedSessionType.price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
