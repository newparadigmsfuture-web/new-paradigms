'use client';

import { useState, useEffect } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Send,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface Payment {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'session' | 'package' | 'subscription';
  createdAt: Date;
}

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  sessions: number;
  popular?: boolean;
}

const STORAGE_KEY = 'demo_payments';

const packages: Package[] = [
  {
    id: '1',
    name: 'Single Session',
    description: 'One 60-minute Bitcoin education session',
    price: 150,
    sessions: 1,
  },
  {
    id: '2',
    name: 'Starter Pack',
    description: '5 sessions with 10% discount',
    price: 675,
    sessions: 5,
    popular: true,
  },
  {
    id: '3',
    name: 'Pro Pack',
    description: '10 sessions with 20% discount',
    price: 1200,
    sessions: 10,
  },
  {
    id: '4',
    name: 'Monthly Subscription',
    description: '4 sessions per month, cancel anytime',
    price: 500,
    sessions: 4,
  },
];

function getStoredPayments(): Payment[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: Payment[] = [
      {
        id: '1',
        clientName: 'John Smith',
        clientEmail: 'john@example.com',
        amount: 150,
        description: 'Single session - Bitcoin basics',
        status: 'completed',
        type: 'session',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah@example.com',
        amount: 675,
        description: 'Starter Pack - 5 sessions',
        status: 'completed',
        type: 'package',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        clientName: 'Michael Brown',
        clientEmail: 'michael@example.com',
        amount: 500,
        description: 'Monthly Subscription - February',
        status: 'pending',
        type: 'subscription',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        clientName: 'Emily Davis',
        clientEmail: 'emily@example.com',
        amount: 1200,
        description: 'Pro Pack - 10 sessions',
        status: 'completed',
        type: 'package',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        clientName: 'David Wilson',
        clientEmail: 'david@example.com',
        amount: 150,
        description: 'Single session - Advanced trading',
        status: 'failed',
        type: 'session',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored).map((p: any) => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));
}

function savePayments(payments: Payment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    clientName: '',
    clientEmail: '',
    amount: '',
    description: '',
    type: 'session' as 'session' | 'package' | 'subscription',
  });

  useEffect(() => {
    setPayments(getStoredPayments());
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingRevenue = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const thisMonthRevenue = payments
    .filter(
      (p) =>
        p.status === 'completed' &&
        p.createdAt.getMonth() === new Date().getMonth() &&
        p.createdAt.getFullYear() === new Date().getFullYear()
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        );
    }
  };

  const handleSendInvoice = () => {
    if (!invoiceForm.clientName || !invoiceForm.clientEmail || !invoiceForm.amount) return;

    const newPayment: Payment = {
      id: Date.now().toString(),
      clientName: invoiceForm.clientName,
      clientEmail: invoiceForm.clientEmail,
      amount: parseFloat(invoiceForm.amount),
      description: invoiceForm.description || 'Invoice',
      status: 'pending',
      type: invoiceForm.type,
      createdAt: new Date(),
    };

    const updated = [newPayment, ...payments];
    setPayments(updated);
    savePayments(updated);
    setIsInvoiceDialogOpen(false);
    setInvoiceForm({
      clientName: '',
      clientEmail: '',
      amount: '',
      description: '',
      type: 'session',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage payments, invoices, and packages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsInvoiceDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(thisMonthRevenue)}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingRevenue)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue / Math.max(payments.filter((p) => p.status === 'completed').length, 1))}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Packages */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Packages & Pricing</CardTitle>
            <CardDescription>Your available service packages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-4 rounded-lg border ${pkg.popular ? 'border-primary bg-primary/5' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {pkg.name}
                      {pkg.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
                  </div>
                  <p className="font-bold text-lg">{formatCurrency(pkg.price)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 10).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.clientName}</p>
                        <p className="text-xs text-muted-foreground">{payment.clientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Stripe Integration Notice */}
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium">Connect Stripe</h4>
              <p className="text-sm text-muted-foreground">
                Accept payments directly from clients with Stripe integration
              </p>
            </div>
          </div>
          <Button>Connect Stripe</Button>
        </CardContent>
      </Card>

      {/* Send Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Invoice</DialogTitle>
            <DialogDescription>Create and send an invoice to your client</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={invoiceForm.clientName}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={invoiceForm.clientEmail}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, clientEmail: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                  placeholder="150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={invoiceForm.type}
                  onValueChange={(value: 'session' | 'package' | 'subscription') =>
                    setInvoiceForm({ ...invoiceForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Session</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={invoiceForm.description}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                placeholder="Bitcoin education session"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvoice}>
              <Send className="mr-2 h-4 w-4" />
              Send Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
