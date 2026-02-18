'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mic,
  FileText,
  Sparkles,
  Clock,
  User,
  Calendar,
  Play,
  Pause,
  Download,
  Search,
  ChevronRight,
  Brain,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  MessageSquare,
} from 'lucide-react';

interface CallSummary {
  id: string;
  clientName: string;
  date: Date;
  duration: number;
  status: 'completed' | 'processing' | 'failed';
  summary?: string;
  keyPoints?: string[];
  actionItems?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  topics?: string[];
  transcript?: string;
}

const STORAGE_KEY = 'demo_call_summaries';

function getStoredSummaries(): CallSummary[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: CallSummary[] = [
      {
        id: '1',
        clientName: 'John Smith',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        duration: 45,
        status: 'completed',
        summary:
          'Discussed Bitcoin basics and wallet setup. Client showed strong interest in understanding security practices. Scheduled follow-up for next week to cover cold storage.',
        keyPoints: [
          'Client new to Bitcoin, learning fundamentals',
          'Interested in long-term investment strategy',
          'Concerned about security and self-custody',
          'Has existing investment portfolio in traditional assets',
        ],
        actionItems: [
          'Send resources on hardware wallets',
          'Schedule follow-up session on cold storage',
          'Share beginner guide PDF',
        ],
        sentiment: 'positive',
        topics: ['Bitcoin Basics', 'Wallet Setup', 'Security'],
        transcript:
          'Client: Hi, I wanted to learn more about Bitcoin...\nEducator: Great! Let me start by explaining the fundamentals...',
      },
      {
        id: '2',
        clientName: 'Sarah Johnson',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        duration: 60,
        status: 'completed',
        summary:
          'Advanced session on Bitcoin trading strategies. Covered technical analysis basics and risk management. Client has prior experience with stocks.',
        keyPoints: [
          'Experienced trader transitioning to crypto',
          'Familiar with technical analysis',
          'Wants to understand Bitcoin-specific patterns',
          'Interested in DCA strategy',
        ],
        actionItems: [
          'Recommend trading tools and platforms',
          'Share TA resources specific to Bitcoin',
          'Discuss portfolio allocation in next session',
        ],
        sentiment: 'positive',
        topics: ['Trading', 'Technical Analysis', 'Risk Management'],
      },
      {
        id: '3',
        clientName: 'Michael Brown',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        duration: 30,
        status: 'completed',
        summary:
          'Initial consultation call. Client is skeptical but curious about Bitcoin. Main concerns are volatility and regulatory risks.',
        keyPoints: [
          'Skeptical about cryptocurrency',
          'Worried about volatility',
          'Regulatory concerns',
          'Open to learning more',
        ],
        actionItems: [
          'Send educational materials on Bitcoin history',
          'Address volatility concerns in follow-up',
          'Provide data on institutional adoption',
        ],
        sentiment: 'neutral',
        topics: ['Introduction', 'Concerns', 'Regulations'],
      },
      {
        id: '4',
        clientName: 'Emily Davis',
        date: new Date(),
        duration: 0,
        status: 'processing',
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored).map((s: any) => ({
    ...s,
    date: new Date(s.date),
  }));
}

function saveSummaries(summaries: CallSummary[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(summaries));
}

export default function AISummariesPage() {
  const [summaries, setSummaries] = useState<CallSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<CallSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    setSummaries(getStoredSummaries());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };

  const formatRecordingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const getSentimentBadge = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-700">Positive</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-700">Negative</Badge>;
      default:
        return <Badge variant="secondary">Neutral</Badge>;
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real app, this would process the recording
    const newSummary: CallSummary = {
      id: Date.now().toString(),
      clientName: 'New Recording',
      date: new Date(),
      duration: Math.floor(recordingTime / 60),
      status: 'processing',
    };
    const updated = [newSummary, ...summaries];
    setSummaries(updated);
    saveSummaries(updated);

    // Simulate processing
    setTimeout(() => {
      const processed = updated.map((s) =>
        s.id === newSummary.id
          ? {
              ...s,
              status: 'completed' as const,
              summary: 'AI-generated summary of the recorded call...',
              keyPoints: ['Point 1', 'Point 2', 'Point 3'],
              actionItems: ['Action 1', 'Action 2'],
              sentiment: 'positive' as const,
              topics: ['General Discussion'],
            }
          : s
      );
      setSummaries(processed);
      saveSummaries(processed);
    }, 3000);
  };

  const filteredSummaries = summaries.filter(
    (s) =>
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topics?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const completedCount = summaries.filter((s) => s.status === 'completed').length;
  const totalMinutes = summaries.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Call Summaries</h1>
          <p className="text-muted-foreground">
            Automatically transcribe and summarize your client calls
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Summaries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Recorded</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalMinutes / 60).toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Items</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaries.reduce((sum, s) => sum + (s.actionItems?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sentiment</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Positive</div>
          </CardContent>
        </Card>
      </div>

      {/* Recording Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-100 animate-pulse'
                    : 'bg-primary/10'
                }`}
              >
                <Mic className={`h-8 w-8 ${isRecording ? 'text-red-600' : 'text-primary'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {isRecording ? 'Recording in Progress' : 'Record a Call'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRecording
                    ? `Duration: ${formatRecordingTime(recordingTime)}`
                    : 'Start recording to auto-generate summaries with AI'}
                </p>
              </div>
            </div>
            <Button
              size="lg"
              variant={isRecording ? 'destructive' : 'default'}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summaries List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Call Summaries</CardTitle>
              <CardDescription>AI-generated summaries of your client calls</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search summaries..."
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSummaries.map((summary) => (
              <div
                key={summary.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedSummary(summary)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      summary.status === 'completed'
                        ? 'bg-green-100'
                        : summary.status === 'processing'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {summary.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : summary.status === 'processing' ? (
                      <Sparkles className="h-5 w-5 text-yellow-600 animate-pulse" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{summary.clientName}</p>
                      {summary.sentiment && getSentimentBadge(summary.sentiment)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(summary.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(summary.duration)}
                      </span>
                      {summary.topics && (
                        <span className="flex items-center gap-1">
                          {summary.topics.slice(0, 2).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Detail Dialog */}
      <Dialog open={!!selectedSummary} onOpenChange={() => setSelectedSummary(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSummary && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">
                      Call with {selectedSummary.clientName}
                    </DialogTitle>
                    <DialogDescription>
                      {formatDate(selectedSummary.date)} • {formatDuration(selectedSummary.duration)}
                    </DialogDescription>
                  </div>
                  {selectedSummary.sentiment && getSentimentBadge(selectedSummary.sentiment)}
                </div>
              </DialogHeader>

              {selectedSummary.status === 'completed' ? (
                <Tabs defaultValue="summary" className="mt-4">
                  <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="actions">Action Items</TabsTrigger>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Summary
                      </h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {selectedSummary.summary}
                      </p>
                    </div>

                    {selectedSummary.keyPoints && (
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          Key Points
                        </h4>
                        <ul className="space-y-2">
                          {selectedSummary.keyPoints.map((point, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedSummary.topics && (
                      <div>
                        <h4 className="font-medium mb-2">Topics Discussed</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSummary.topics.map((topic) => (
                            <Badge key={topic} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="actions" className="mt-4">
                    {selectedSummary.actionItems && selectedSummary.actionItems.length > 0 ? (
                      <div className="space-y-3">
                        {selectedSummary.actionItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 border rounded-lg"
                          >
                            <Target className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium">{item}</p>
                              <p className="text-xs text-muted-foreground">
                                Added from call summary
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No action items identified
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="transcript" className="mt-4">
                    {selectedSummary.transcript ? (
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {selectedSummary.transcript}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Full transcript not available
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              ) : selectedSummary.status === 'processing' ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="h-12 w-12 text-yellow-500 animate-pulse mb-4" />
                  <p className="font-medium">Processing with AI</p>
                  <p className="text-sm text-muted-foreground">
                    This may take a few moments...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <p className="font-medium">Processing Failed</p>
                  <p className="text-sm text-muted-foreground">
                    Unable to generate summary for this call
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedSummary(null)}>
                  Close
                </Button>
                {selectedSummary.status === 'completed' && (
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
