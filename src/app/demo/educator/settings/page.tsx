'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Bell,
  Calendar,
  Video,
  Globe,
  Lock,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle,
  Smartphone,
  Slack,
  Link as LinkIcon,
} from 'lucide-react';

interface Settings {
  profile: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    timezone: string;
    language: string;
  };
  notifications: {
    emailReminders: boolean;
    smsReminders: boolean;
    reminderTime: string;
    newLeadAlerts: boolean;
    paymentAlerts: boolean;
    weeklyReport: boolean;
  };
  calendar: {
    defaultDuration: number;
    bufferTime: number;
    workingHoursStart: string;
    workingHoursEnd: string;
    workingDays: string[];
    autoConfirm: boolean;
  };
  integrations: {
    zoom: boolean;
    googleMeet: boolean;
    slack: boolean;
    googleCalendar: boolean;
  };
}

const STORAGE_KEY = 'demo_settings';

const defaultSettings: Settings = {
  profile: {
    name: 'Demo User',
    email: 'demo@newparadigms.com',
    phone: '+1 555-0100',
    bio: 'Bitcoin educator passionate about helping people understand cryptocurrency.',
    timezone: 'America/New_York',
    language: 'en',
  },
  notifications: {
    emailReminders: true,
    smsReminders: false,
    reminderTime: '24h',
    newLeadAlerts: true,
    paymentAlerts: true,
    weeklyReport: true,
  },
  calendar: {
    defaultDuration: 60,
    bufferTime: 15,
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    autoConfirm: false,
  },
  integrations: {
    zoom: false,
    googleMeet: false,
    slack: false,
    googleCalendar: false,
  },
};

function getStoredSettings(): Settings {
  if (typeof window === 'undefined') return defaultSettings;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
  return JSON.parse(stored);
}

function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateProfile = (field: keyof Settings['profile'], value: string) => {
    setSettings({
      ...settings,
      profile: { ...settings.profile, [field]: value },
    });
  };

  const updateNotifications = (
    field: keyof Settings['notifications'],
    value: boolean | string
  ) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value },
    });
  };

  const updateCalendar = (
    field: keyof Settings['calendar'],
    value: number | string | string[] | boolean
  ) => {
    setSettings({
      ...settings,
      calendar: { ...settings.calendar, [field]: value },
    });
  };

  const updateIntegrations = (field: keyof Settings['integrations'], value: boolean) => {
    setSettings({
      ...settings,
      integrations: { ...settings.integrations, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => updateProfile('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.profile.phone}
                    onChange={(e) => updateProfile('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.profile.timezone}
                    onValueChange={(value) => updateProfile('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={settings.profile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  rows={4}
                  placeholder="Tell clients about yourself..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.profile.language}
                  onValueChange={(value) => updateProfile('language', value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appointment Reminders</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Receive appointment reminders via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.emailReminders}
                      onCheckedChange={(checked) =>
                        updateNotifications('emailReminders', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Receive appointment reminders via SMS
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.smsReminders}
                      onCheckedChange={(checked) =>
                        updateNotifications('smsReminders', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Reminder Timing</p>
                        <p className="text-sm text-muted-foreground">
                          When to send reminders before appointments
                        </p>
                      </div>
                    </div>
                    <Select
                      value={settings.notifications.reminderTime}
                      onValueChange={(value) => updateNotifications('reminderTime', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="3h">3 hours</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                        <SelectItem value="48h">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">Activity Alerts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Lead Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new leads are added
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newLeadAlerts}
                      onCheckedChange={(checked) =>
                        updateNotifications('newLeadAlerts', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about payment activities
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.paymentAlerts}
                      onCheckedChange={(checked) =>
                        updateNotifications('paymentAlerts', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Report</p>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of your performance
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.weeklyReport}
                      onCheckedChange={(checked) =>
                        updateNotifications('weeklyReport', checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Settings */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar & Scheduling</CardTitle>
              <CardDescription>
                Configure your availability and booking preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Session Duration</Label>
                  <Select
                    value={settings.calendar.defaultDuration.toString()}
                    onValueChange={(value) =>
                      updateCalendar('defaultDuration', parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Buffer Time Between Sessions</Label>
                  <Select
                    value={settings.calendar.bufferTime.toString()}
                    onValueChange={(value) =>
                      updateCalendar('bufferTime', parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No buffer</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Working Hours Start</Label>
                  <Input
                    type="time"
                    value={settings.calendar.workingHoursStart}
                    onChange={(e) =>
                      updateCalendar('workingHoursStart', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Working Hours End</Label>
                  <Input
                    type="time"
                    value={settings.calendar.workingHoursEnd}
                    onChange={(e) =>
                      updateCalendar('workingHoursEnd', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Working Days</Label>
                <div className="flex flex-wrap gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
                    (day) => (
                      <Button
                        key={day}
                        variant={
                          settings.calendar.workingDays.includes(day)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          const days = settings.calendar.workingDays.includes(day)
                            ? settings.calendar.workingDays.filter((d) => d !== day)
                            : [...settings.calendar.workingDays, day];
                          updateCalendar('workingDays', days);
                        }}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Auto-confirm Bookings</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically confirm new bookings without manual approval
                  </p>
                </div>
                <Switch
                  checked={settings.calendar.autoConfirm}
                  onCheckedChange={(checked) => updateCalendar('autoConfirm', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Video Conferencing</CardTitle>
                <CardDescription>
                  Connect video platforms to auto-generate meeting links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                      <Video className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Zoom</p>
                      <p className="text-sm text-muted-foreground">
                        Auto-generate Zoom meeting links
                      </p>
                    </div>
                  </div>
                  {settings.integrations.zoom ? (
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => updateIntegrations('zoom', true)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center">
                      <Video className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google Meet</p>
                      <p className="text-sm text-muted-foreground">
                        Auto-generate Google Meet links
                      </p>
                    </div>
                  </div>
                  {settings.integrations.googleMeet ? (
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => updateIntegrations('googleMeet', true)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar Sync</CardTitle>
                <CardDescription>
                  Sync your appointments with external calendars
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-red-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        Two-way sync with Google Calendar
                      </p>
                    </div>
                  </div>
                  {settings.integrations.googleCalendar ? (
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => updateIntegrations('googleCalendar', true)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
                <CardDescription>
                  Connect communication tools for notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center">
                      <Slack className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Slack</p>
                      <p className="text-sm text-muted-foreground">
                        Get notifications in your Slack workspace
                      </p>
                    </div>
                  </div>
                  {settings.integrations.slack ? (
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => updateIntegrations('slack', true)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
