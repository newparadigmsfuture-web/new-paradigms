'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChatWindow } from '@/components/chat/chat-window';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Plus, Loader2 } from 'lucide-react';
import { User, Conversation } from '@/types';
import { getInitials } from '@/lib/utils';

export default function EducatorMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      // Fetch current user
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userData) {
        setCurrentUser(userData);
      }

      // Fetch conversations
      const { data: convData } = await supabase
        .from('conversations')
        .select('*')
        .contains('participant_ids', [authUser.id])
        .order('created_at', { ascending: false });

      if (convData) {
        setConversations(convData);
      }

      // Fetch trainers and admins for new conversations
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .in('role', ['trainer', 'admin'])
        .neq('id', authUser.id);

      if (usersData) {
        setUsers(usersData);
      }

      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const startConversation = async (otherUser: User) => {
    if (!currentUser) return;

    // Check if conversation already exists
    const existingConv = conversations.find(
      (c) =>
        c.participant_ids.includes(currentUser.id) &&
        c.participant_ids.includes(otherUser.id)
    );

    if (existingConv) {
      setSelectedConversation(existingConv);
      setSelectedUser(otherUser);
      return;
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({
        participant_ids: [currentUser.id, otherUser.id],
        type: 'direct',
      })
      .select()
      .single();

    if (newConv && !error) {
      setConversations((prev) => [newConv, ...prev]);
      setSelectedConversation(newConv);
      setSelectedUser(otherUser);
    }
  };

  const getOtherParticipant = (conversation: Conversation): User | undefined => {
    const otherId = conversation.participant_ids.find((id) => id !== currentUser?.id);
    return users.find((u) => u.id === otherId);
  };

  const filteredUsers = users.filter((u) =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with your trainers and managers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-250px)]">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {searchQuery ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Start new conversation</p>
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => startConversation(user)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No users found
                  </p>
                )}
              </div>
            ) : conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  if (!other) return null;

                  return (
                    <div
                      key={conv.id}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer ${
                        selectedConversation?.id === conv.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => {
                        setSelectedConversation(conv);
                        setSelectedUser(other);
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={other.avatar_url || undefined} />
                        <AvatarFallback>{getInitials(other.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{other.full_name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{other.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Search for a user to start chatting</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation && selectedUser && currentUser ? (
            <ChatWindow
              conversation={selectedConversation}
              currentUser={currentUser}
              otherUser={selectedUser}
            />
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
