import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { User } from '@/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!userData) {
    redirect('/login');
  }

  const user: User = userData;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={user.role} />
      <div className="lg:pl-64">
        <Header user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
