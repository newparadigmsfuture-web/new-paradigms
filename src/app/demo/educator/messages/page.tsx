'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

const STORAGE_KEY = 'demo_messages';

function getStoredConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: Conversation[] = [
      {
        id: '1',
        participantName: 'Sarah Chen',
        participantRole: 'Trainer',
        lastMessage: "Great work on your last session! Let's discuss your progress.",
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 2,
        online: true,
        messages: [
          {
            id: 'm1',
            senderId: 'trainer',
            content: 'Hi! How did your session with the new client go?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: 'm2',
            senderId: 'me',
            content:
              'It went really well! They were very engaged and asked great questions about Bitcoin security.',
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: 'm3',
            senderId: 'trainer',
            content:
              "That's excellent! Security is such an important topic. Did you cover hardware wallets?",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: 'm4',
            senderId: 'me',
            content:
              'Yes, I showed them how to set one up. They were impressed by how easy it was.',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            read: true,
          },
          {
            id: 'm5',
            senderId: 'trainer',
            content: "Great work on your last session! Let's discuss your progress.",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            read: false,
          },
        ],
      },
      {
        id: '2',
        participantName: 'Michael Rodriguez',
        participantRole: 'Manager',
        lastMessage: 'The monthly report looks good. Keep up the great work!',
        lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        unreadCount: 0,
        online: false,
        messages: [
          {
            id: 'm1',
            senderId: 'manager',
            content: "I've reviewed your monthly performance report.",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: 'm2',
            senderId: 'manager',
            content: 'The monthly report looks good. Keep up the great work!',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            read: true,
          },
        ],
      },
      {
        id: '3',
        participantName: 'Team Announcements',
        participantRole: 'Group',
        lastMessage: 'New training materials are now available in the Resources section.',
        lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        unreadCount: 1,
        online: false,
        messages: [
          {
            id: 'm1',
            senderId: 'system',
            content: 'Welcome to the team chat! This is where company announcements will be posted.',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: 'm2',
            senderId: 'system',
            content: 'New training materials are now available in the Resources section.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            read: false,
          },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored).map((c: any) => ({
    ...c,
    lastMessageTime: new Date(c.lastMessageTime),
    messages: c.messages.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })),
  }));
}

function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convs = getStoredConversations();
    setConversations(convs);
    if (convs.length > 0) {
      setSelectedConversation(convs[0]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date(),
      read: true,
    };

    const updatedConversations = conversations.map((c) =>
      c.id === selectedConversation.id
        ? {
            ...c,
            messages: [...c.messages, message],
            lastMessage: newMessage,
            lastMessageTime: new Date(),
          }
        : c
    );

    setConversations(updatedConversations);
    saveConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date(),
    });
    setNewMessage('');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    // Mark messages as read
    const updatedConversations = conversations.map((c) =>
      c.id === conversation.id
        ? {
            ...c,
            unreadCount: 0,
            messages: c.messages.map((m) => ({ ...m, read: true })),
          }
        : c
    );
    setConversations(updatedConversations);
    saveConversations(updatedConversations);
    setSelectedConversation({
      ...conversation,
      unreadCount: 0,
      messages: conversation.messages.map((m) => ({ ...m, read: true })),
    });
  };

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            {totalUnread > 0 ? `${totalUnread} unread messages` : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Conversations List */}
        <Card className="col-span-1">
          <CardHeader className="py-3 px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-5rem)]">
            <div className="px-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary/10'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{getInitials(conversation.participantName)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.participantName}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(selectedConversation.participantName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.participantName}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.online ? (
                        <span className="text-green-600">Online</span>
                      ) : (
                        selectedConversation.participantRole
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => {
                    const isMe = message.senderId === 'me';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 ${
                              isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}
                          >
                            <span className="text-xs">
                              {formatMessageTime(message.timestamp)}
                            </span>
                            {isMe && (
                              message.read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
