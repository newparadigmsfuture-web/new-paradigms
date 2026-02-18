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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Gift,
  DollarSign,
  Copy,
  CheckCircle,
  Clock,
  Share2,
  Mail,
  TrendingUp,
  Award,
} from 'lucide-react';

interface Referral {
  id: string;
  referredName: string;
  referredEmail: string;
  status: 'pending' | 'converted' | 'expired';
  reward: number;
  createdAt: Date;
  convertedAt?: Date;
}

const STORAGE_KEY = 'demo_referrals';

function getStoredReferrals(): Referral[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: Referral[] = [
      {
        id: '1',
        referredName: 'Alice Thompson',
        referredEmail: 'alice@example.com',
        status: 'converted',
        reward: 50,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        convertedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        referredName: 'Bob Martinez',
        referredEmail: 'bob@example.com',
        status: 'converted',
        reward: 50,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        convertedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        referredName: 'Carol White',
        referredEmail: 'carol@example.com',
        status: 'pending',
        reward: 50,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        referredName: 'David Lee',
        referredEmail: 'david@example.com',
        status: 'pending',
        reward: 50,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        referredName: 'Emma Garcia',
        referredEmail: 'emma@example.com',
        status: 'expired',
        reward: 0,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored).map((r: any) => ({
    ...r,
    createdAt: new Date(r.createdAt),
    convertedAt: r.convertedAt ? new Date(r.convertedAt) : undefined,
  }));
}

function saveReferrals(referrals: Referral[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(referrals));
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
  });

  const referralCode = 'NEWPARADIGMS2024';
  const referralLink = `https://newparadigms.com/ref/${referralCode}`;

  useEffect(() => {
    setReferrals(getStoredReferrals());
  }, []);

  const totalEarned = referrals
    .filter((r) => r.status === 'converted')
    .reduce((sum, r) => sum + r.reward, 0);

  const pendingRewards = referrals
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.reward, 0);

  const convertedCount = referrals.filter((r) => r.status === 'converted').length;
  const pendingCount = referrals.filter((r) => r.status === 'pending').length;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = () => {
    if (!inviteForm.name || !inviteForm.email) return;

    const newReferral: Referral = {
      id: Date.now().toString(),
      referredName: inviteForm.name,
      referredEmail: inviteForm.email,
      status: 'pending',
      reward: 50,
      createdAt: new Date(),
    };

    const updated = [newReferral, ...referrals];
    setReferrals(updated);
    saveReferrals(updated);
    setIsInviteDialogOpen(false);
    setInviteForm({ name: '', email: '' });
  };

  const getStatusBadge = (status: Referral['status']) => {
    switch (status) {
      case 'converted':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" /> Converted
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary">Expired</Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Referral Program</h1>
          <p className="text-muted-foreground">
            Earn rewards by referring new clients and educators
          </p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <Mail className="mr-2 h-4 w-4" />
          Send Invite
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEarned)}</div>
            <p className="text-xs text-muted-foreground">From {convertedCount} referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingRewards)}</div>
            <p className="text-xs text-muted-foreground">{pendingCount} pending conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {referrals.length > 0
                ? Math.round((convertedCount / referrals.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Of total invites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends. You earn $50 for each successful referral!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="bg-muted" />
            <Button onClick={handleCopyLink} variant={copied ? 'default' : 'outline'}>
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              Code: {referralCode}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Reward: <span className="font-medium text-green-600">$50</span> per conversion
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Rewards Tiers
          </CardTitle>
          <CardDescription>Earn more as you refer more people</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Bronze</span>
              </div>
              <p className="text-2xl font-bold">$50</p>
              <p className="text-sm text-muted-foreground">Per referral (1-5 referrals)</p>
            </div>
            <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Silver</span>
              </div>
              <p className="text-2xl font-bold">$75</p>
              <p className="text-sm text-muted-foreground">Per referral (6-15 referrals)</p>
            </div>
            <div className="p-4 rounded-lg border bg-purple-50 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Gold</span>
              </div>
              <p className="text-2xl font-bold">$100</p>
              <p className="text-sm text-muted-foreground">Per referral (16+ referrals)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track all your referrals and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referred Person</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Converted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(referral.referredName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{referral.referredName}</p>
                        <p className="text-xs text-muted-foreground">{referral.referredEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(referral.status)}</TableCell>
                  <TableCell>
                    <span className={referral.status === 'converted' ? 'text-green-600 font-medium' : ''}>
                      {referral.status === 'converted' ? formatCurrency(referral.reward) : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(referral.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {referral.convertedAt ? formatDate(referral.convertedAt) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Send Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Referral Invite</DialogTitle>
            <DialogDescription>
              Invite someone to join New Paradigms. They will receive an email with your referral link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Their Name</Label>
              <Input
                id="name"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Their Email</Label>
              <Input
                id="email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvite}>
              <Mail className="mr-2 h-4 w-4" />
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
