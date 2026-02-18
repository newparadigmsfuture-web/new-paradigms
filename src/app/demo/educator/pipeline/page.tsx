'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  Trash2,
  Edit,
  GripVertical,
} from 'lucide-react';

type PipelineStage = 'lead' | 'contacted' | 'interested' | 'negotiating' | 'converted' | 'lost';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: PipelineStage;
  source: string;
  value: number;
  notes: string;
  lastContact: Date;
  createdAt: Date;
  type: 'customer' | 'potential_be';
}

const STORAGE_KEY = 'demo_pipeline';

const stages: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'lead', label: 'New Lead', color: 'bg-gray-100 border-gray-300' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-50 border-blue-300' },
  { id: 'interested', label: 'Interested', color: 'bg-yellow-50 border-yellow-300' },
  { id: 'negotiating', label: 'Negotiating', color: 'bg-purple-50 border-purple-300' },
  { id: 'converted', label: 'Converted', color: 'bg-green-50 border-green-300' },
  { id: 'lost', label: 'Lost', color: 'bg-red-50 border-red-300' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getStoredLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: Lead[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1 555-0102',
        stage: 'lead',
        source: 'Website',
        value: 500,
        notes: 'Interested in Bitcoin basics course',
        lastContact: new Date(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'customer',
      },
      {
        id: '2',
        name: 'Bob Williams',
        email: 'bob@example.com',
        phone: '+1 555-0103',
        stage: 'contacted',
        source: 'Referral',
        value: 1200,
        notes: 'Referred by John Smith. Looking for advanced training.',
        lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        type: 'customer',
      },
      {
        id: '3',
        name: 'Carol Davis',
        email: 'carol@example.com',
        phone: '+1 555-0104',
        stage: 'interested',
        source: 'LinkedIn',
        value: 2000,
        notes: 'Wants to become a BE. Has finance background.',
        lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        type: 'potential_be',
      },
      {
        id: '4',
        name: 'David Lee',
        email: 'david@example.com',
        phone: '+1 555-0105',
        stage: 'negotiating',
        source: 'Event',
        value: 3500,
        notes: 'Met at Bitcoin conference. Very motivated.',
        lastContact: new Date(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        type: 'potential_be',
      },
      {
        id: '5',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        phone: '+1 555-0106',
        stage: 'converted',
        source: 'Website',
        value: 800,
        notes: 'Completed onboarding. First session scheduled.',
        lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        type: 'customer',
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored).map((lead: any) => ({
    ...lead,
    lastContact: new Date(lead.lastContact),
    createdAt: new Date(lead.createdAt),
  }));
}

function saveLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    value: '',
    notes: '',
    type: 'customer' as 'customer' | 'potential_be',
  });

  useEffect(() => {
    setLeads(getStoredLeads());
  }, []);

  const handleAddLead = () => {
    setEditingLead(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      source: '',
      value: '',
      notes: '',
      type: 'customer',
    });
    setIsDialogOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      value: lead.value.toString(),
      notes: lead.notes,
      type: lead.type,
    });
    setIsDialogOpen(true);
  };

  const handleSaveLead = () => {
    if (!formData.name || !formData.email) return;

    if (editingLead) {
      const updated = leads.map((l) =>
        l.id === editingLead.id
          ? {
              ...l,
              ...formData,
              value: parseFloat(formData.value) || 0,
              lastContact: new Date(),
            }
          : l
      );
      setLeads(updated);
      saveLeads(updated);
    } else {
      const newLead: Lead = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        stage: 'lead',
        source: formData.source,
        value: parseFloat(formData.value) || 0,
        notes: formData.notes,
        lastContact: new Date(),
        createdAt: new Date(),
        type: formData.type,
      };
      const updated = [...leads, newLead];
      setLeads(updated);
      saveLeads(updated);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    saveLeads(updated);
  };

  const handleMoveStage = (lead: Lead, newStage: PipelineStage) => {
    const updated = leads.map((l) =>
      l.id === lead.id ? { ...l, stage: newStage, lastContact: new Date() } : l
    );
    setLeads(updated);
    saveLeads(updated);
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    if (draggedLead && draggedLead.stage !== stage) {
      handleMoveStage(draggedLead, stage);
    }
    setDraggedLead(null);
  };

  const getLeadsByStage = (stage: PipelineStage) => leads.filter((l) => l.stage === stage);

  const getTotalValue = (stage: PipelineStage) =>
    getLeadsByStage(stage).reduce((sum, l) => sum + l.value, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Pipeline</h1>
          <p className="text-muted-foreground">
            Track and manage your leads through the sales process
          </p>
        </div>
        <Button onClick={handleAddLead}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="text-center">
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{getLeadsByStage(stage.id).length}</p>
              <p className="text-xs text-muted-foreground">{stage.label}</p>
              <p className="text-sm font-medium text-green-600 mt-1">
                {formatCurrency(getTotalValue(stage.id))}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`flex-shrink-0 w-80 rounded-lg border-2 ${stage.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="p-3 border-b bg-white/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{stage.label}</h3>
                <Badge variant="secondary">{getLeadsByStage(stage.id).length}</Badge>
              </div>
            </div>
            <div className="p-2 space-y-2 min-h-[400px]">
              {getLeadsByStage(stage.id).map((lead) => (
                <Card
                  key={lead.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(lead.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{lead.name}</p>
                          <Badge
                            variant="outline"
                            className={
                              lead.type === 'potential_be'
                                ? 'text-purple-600 border-purple-300'
                                : 'text-blue-600 border-blue-300'
                            }
                          >
                            {lead.type === 'potential_be' ? 'Potential BE' : 'Customer'}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {stage.id !== 'converted' && (
                            <DropdownMenuItem
                              onClick={() => {
                                const currentIndex = stages.findIndex((s) => s.id === lead.stage);
                                if (currentIndex < stages.length - 2) {
                                  handleMoveStage(lead, stages[currentIndex + 1].id);
                                }
                              }}
                            >
                              <ArrowRight className="mr-2 h-4 w-4" />
                              Move to Next Stage
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(lead.value)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(lead.lastContact)}
                        </div>
                      </div>
                    </div>
                    {lead.notes && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-muted p-1.5 rounded">
                        {lead.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Lead Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
            <DialogDescription>
              {editingLead
                ? 'Update the lead information below.'
                : 'Enter the details for the new lead.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Lead Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'customer' | 'potential_be') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="potential_be">Potential BE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Estimated Value ($)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional information about this lead..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLead}>{editingLead ? 'Update' : 'Add Lead'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
