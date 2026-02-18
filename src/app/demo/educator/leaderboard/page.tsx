'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Target,
  Flame,
  Award,
  Crown,
  Zap,
  Users,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  appointments: number;
  conversions: number;
  streak: number;
  badges: string[];
  isCurrentUser?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  deadline: Date;
  type: 'daily' | 'weekly' | 'monthly';
}

const leaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    points: 2450,
    rank: 1,
    appointments: 45,
    conversions: 18,
    streak: 21,
    badges: ['Top Performer', 'Conversion Master', 'Streak King'],
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    points: 2180,
    rank: 2,
    appointments: 38,
    conversions: 15,
    streak: 14,
    badges: ['Rising Star', 'Client Favorite'],
  },
  {
    id: '3',
    name: 'Demo User',
    points: 1950,
    rank: 3,
    appointments: 32,
    conversions: 12,
    streak: 7,
    badges: ['Quick Learner', 'Team Player'],
    isCurrentUser: true,
  },
  {
    id: '4',
    name: 'Emily Thompson',
    points: 1820,
    rank: 4,
    appointments: 29,
    conversions: 11,
    streak: 5,
    badges: ['Consistent Performer'],
  },
  {
    id: '5',
    name: 'James Wilson',
    points: 1650,
    rank: 5,
    appointments: 25,
    conversions: 9,
    streak: 3,
    badges: [],
  },
  {
    id: '6',
    name: 'Lisa Park',
    points: 1480,
    rank: 6,
    appointments: 22,
    conversions: 8,
    streak: 2,
    badges: [],
  },
  {
    id: '7',
    name: 'David Kim',
    points: 1320,
    rank: 7,
    appointments: 19,
    conversions: 7,
    streak: 0,
    badges: [],
  },
  {
    id: '8',
    name: 'Anna Martinez',
    points: 1150,
    rank: 8,
    appointments: 16,
    conversions: 5,
    streak: 1,
    badges: [],
  },
];

const achievements: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first appointment',
    icon: Star,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: '2',
    name: 'Quick Learner',
    description: 'Complete 5 learning modules',
    icon: Zap,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: '3',
    name: 'Conversion Pro',
    description: 'Convert 10 leads to clients',
    icon: Target,
    unlocked: true,
    progress: 12,
    maxProgress: 10,
    rarity: 'rare',
  },
  {
    id: '4',
    name: 'Streak Master',
    description: 'Maintain a 7-day activity streak',
    icon: Flame,
    unlocked: true,
    rarity: 'rare',
  },
  {
    id: '5',
    name: 'Team Player',
    description: 'Refer 3 new educators',
    icon: Users,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    rarity: 'epic',
  },
  {
    id: '6',
    name: 'Revenue King',
    description: 'Generate $10,000 in revenue',
    icon: Crown,
    unlocked: false,
    progress: 7500,
    maxProgress: 10000,
    rarity: 'legendary',
  },
];

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Daily Warrior',
    description: 'Complete 3 appointments today',
    reward: 50,
    progress: 2,
    target: 3,
    deadline: new Date(new Date().setHours(23, 59, 59)),
    type: 'daily',
  },
  {
    id: '2',
    title: 'Weekly Champion',
    description: 'Convert 5 leads this week',
    reward: 200,
    progress: 3,
    target: 5,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    type: 'weekly',
  },
  {
    id: '3',
    title: 'Monthly Master',
    description: 'Earn $5,000 in revenue this month',
    reward: 500,
    progress: 3200,
    target: 5000,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    type: 'monthly',
  },
];

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-medium">#{rank}</span>;
  }
}

function getRarityColor(rarity: Achievement['rarity']) {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'rare':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'epic':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'legendary':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  }
}

export default function LeaderboardPage() {
  const [user] = useState<any>({ full_name: 'Demo User' });

  const currentUserEntry = leaderboard.find((e) => e.isCurrentUser);
  const totalPoints = currentUserEntry?.points || 0;
  const nextLevelPoints = 2500;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard & Achievements</h1>
          <p className="text-muted-foreground">
            Compete with other educators and earn rewards
          </p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">#{currentUserEntry?.rank || '-'}</div>
            <p className="text-xs text-muted-foreground">Out of {leaderboard.length} educators</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
            <Progress value={(totalPoints / nextLevelPoints) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {nextLevelPoints - totalPoints} to next level
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUserEntry?.streak || 0} days</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievements.filter((a) => a.unlocked).length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {achievements.length} available
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Top Educators This Month</CardTitle>
              <CardDescription>Based on appointments, conversions, and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      entry.isCurrentUser
                        ? 'bg-primary/5 border-primary/30'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {entry.name}
                          {entry.isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">
                              You
                            </Badge>
                          )}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {entry.appointments} appts
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {entry.conversions} converts
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {entry.streak} days
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.points.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card
                  key={achievement.id}
                  className={`${!achievement.unlocked ? 'opacity-60' : ''}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${getRarityColor(
                          achievement.rarity
                        )}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mt-4">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                    {achievement.maxProgress && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>
                            {achievement.progress} / {achievement.maxProgress}
                          </span>
                        </div>
                        <Progress
                          value={(achievement.progress! / achievement.maxProgress) * 100}
                        />
                      </div>
                    )}
                    {achievement.unlocked && (
                      <Badge className="mt-3 bg-green-100 text-green-700">
                        <Award className="mr-1 h-3 w-3" />
                        Unlocked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const progress = (challenge.progress / challenge.target) * 100;
              const timeLeft = Math.ceil(
                (challenge.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              return (
                <Card key={challenge.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              challenge.type === 'daily'
                                ? 'border-blue-300 text-blue-700'
                                : challenge.type === 'weekly'
                                ? 'border-purple-300 text-purple-700'
                                : 'border-orange-300 text-orange-700'
                            }
                          >
                            {challenge.type}
                          </Badge>
                          <h3 className="font-semibold">{challenge.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {challenge.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">+{challenge.reward}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          {challenge.progress.toLocaleString()} / {challenge.target.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          {timeLeft > 0 ? `${timeLeft} days left` : 'Expired'}
                        </span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
