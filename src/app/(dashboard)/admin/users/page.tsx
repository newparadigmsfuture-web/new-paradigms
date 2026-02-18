import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Shield, GraduationCap, Briefcase } from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  const educators = users?.filter((u) => u.role === 'educator') || [];
  const trainers = users?.filter((u) => u.role === 'trainer') || [];
  const admins = users?.filter((u) => u.role === 'admin') || [];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'educator':
        return GraduationCap;
      case 'trainer':
        return Briefcase;
      case 'admin':
        return Shield;
      default:
        return Users;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'educator':
        return 'default';
      case 'trainer':
        return 'secondary';
      case 'admin':
        return 'outline';
      default:
        return 'default';
    }
  };

  const UserCard = ({ user }: { user: any }) => {
    const Icon = getRoleIcon(user.role);
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Joined {formatDate(user.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getRoleBadgeVariant(user.role) as any} className="capitalize">
            <Icon className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
          <Button variant="ghost" size="sm">
            Manage
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions.
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Bitcoin Educators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{educators.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Trainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all users in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({users?.length || 0})</TabsTrigger>
              <TabsTrigger value="educators">Educators ({educators.length})</TabsTrigger>
              <TabsTrigger value="trainers">Trainers ({trainers.length})</TabsTrigger>
              <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-3">
                {users?.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
                {!users?.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="educators" className="mt-4">
              <div className="space-y-3">
                {educators.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
                {!educators.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    No educators found
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trainers" className="mt-4">
              <div className="space-y-3">
                {trainers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
                {!trainers.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    No trainers found
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="admins" className="mt-4">
              <div className="space-y-3">
                {admins.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
                {!admins.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    No administrators found
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
