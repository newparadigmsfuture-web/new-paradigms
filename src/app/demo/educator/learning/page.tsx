'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Award,
  Lock,
  ChevronRight,
  FileText,
  Video,
  Trophy,
  Star,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  lessons: Lesson[];
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  certificate: boolean;
}

interface Certificate {
  id: string;
  courseName: string;
  completedAt: Date;
  grade: string;
}

const PROGRESS_KEY = 'demo_learning_progress';

const courses: Course[] = [
  {
    id: '1',
    title: 'Bitcoin Fundamentals',
    description: 'Master the basics of Bitcoin, blockchain technology, and cryptocurrency concepts.',
    category: 'Fundamentals',
    level: 'beginner',
    estimatedTime: '4 hours',
    certificate: true,
    lessons: [
      { id: '1-1', title: 'What is Bitcoin?', duration: '15 min', type: 'video', completed: true },
      { id: '1-2', title: 'How Blockchain Works', duration: '20 min', type: 'video', completed: true },
      { id: '1-3', title: 'Bitcoin vs Traditional Currency', duration: '12 min', type: 'article', completed: true },
      { id: '1-4', title: 'Setting Up a Wallet', duration: '18 min', type: 'video', completed: false },
      { id: '1-5', title: 'Making Your First Transaction', duration: '15 min', type: 'video', completed: false },
      { id: '1-6', title: 'Module Quiz', duration: '10 min', type: 'quiz', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Client Communication Skills',
    description: 'Learn effective communication techniques for educating clients about Bitcoin.',
    category: 'Skills',
    level: 'intermediate',
    estimatedTime: '3 hours',
    certificate: true,
    lessons: [
      { id: '2-1', title: 'Understanding Client Concerns', duration: '20 min', type: 'video', completed: false },
      { id: '2-2', title: 'Explaining Complex Concepts Simply', duration: '25 min', type: 'video', completed: false },
      { id: '2-3', title: 'Handling Objections', duration: '15 min', type: 'article', completed: false },
      { id: '2-4', title: 'Building Trust', duration: '18 min', type: 'video', completed: false },
      { id: '2-5', title: 'Role Play Scenarios', duration: '30 min', type: 'video', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Advanced Trading Strategies',
    description: 'Deep dive into advanced Bitcoin trading concepts and strategies.',
    category: 'Trading',
    level: 'advanced',
    estimatedTime: '6 hours',
    certificate: true,
    lessons: [
      { id: '3-1', title: 'Technical Analysis Basics', duration: '30 min', type: 'video', completed: false },
      { id: '3-2', title: 'Chart Patterns', duration: '25 min', type: 'video', completed: false },
      { id: '3-3', title: 'Risk Management', duration: '20 min', type: 'article', completed: false },
      { id: '3-4', title: 'Portfolio Diversification', duration: '22 min', type: 'video', completed: false },
      { id: '3-5', title: 'Market Psychology', duration: '28 min', type: 'video', completed: false },
      { id: '3-6', title: 'Final Assessment', duration: '30 min', type: 'quiz', completed: false },
    ],
  },
  {
    id: '4',
    title: 'Security Best Practices',
    description: 'Essential security knowledge for protecting Bitcoin assets.',
    category: 'Security',
    level: 'intermediate',
    estimatedTime: '2.5 hours',
    certificate: true,
    lessons: [
      { id: '4-1', title: 'Understanding Security Threats', duration: '15 min', type: 'video', completed: false },
      { id: '4-2', title: 'Hardware Wallets', duration: '20 min', type: 'video', completed: false },
      { id: '4-3', title: 'Seed Phrase Management', duration: '18 min', type: 'article', completed: false },
      { id: '4-4', title: 'Two-Factor Authentication', duration: '12 min', type: 'video', completed: false },
    ],
  },
];

const certificates: Certificate[] = [
  {
    id: '1',
    courseName: 'Bitcoin Fundamentals',
    completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    grade: 'A',
  },
];

function getLessonIcon(type: Lesson['type']) {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'article':
      return <FileText className="h-4 w-4" />;
    case 'quiz':
      return <Award className="h-4 w-4" />;
  }
}

function getLevelBadge(level: Course['level']) {
  switch (level) {
    case 'beginner':
      return <Badge className="bg-green-100 text-green-700">Beginner</Badge>;
    case 'intermediate':
      return <Badge className="bg-yellow-100 text-yellow-700">Intermediate</Badge>;
    case 'advanced':
      return <Badge className="bg-red-100 text-red-700">Advanced</Badge>;
  }
}

export default function LearningPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseProgress, setCourseProgress] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      setCourseProgress(JSON.parse(stored));
    } else {
      // Initialize with some progress
      const initial = { '1': ['1-1', '1-2', '1-3'] };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(initial));
      setCourseProgress(initial);
    }
  }, []);

  const toggleLessonComplete = (courseId: string, lessonId: string) => {
    const currentProgress = courseProgress[courseId] || [];
    let newProgress: string[];

    if (currentProgress.includes(lessonId)) {
      newProgress = currentProgress.filter((id) => id !== lessonId);
    } else {
      newProgress = [...currentProgress, lessonId];
    }

    const updated = { ...courseProgress, [courseId]: newProgress };
    setCourseProgress(updated);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  };

  const getCourseProgress = (course: Course) => {
    const completed = courseProgress[course.id]?.length || 0;
    return Math.round((completed / course.lessons.length) * 100);
  };

  const isLessonCompleted = (courseId: string, lessonId: string) => {
    return courseProgress[courseId]?.includes(lessonId) || false;
  };

  const totalCompleted = Object.values(courseProgress).flat().length;
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Center</h1>
          <p className="text-muted-foreground">
            Complete courses to improve your skills and earn certificates
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((totalCompleted / totalLessons) * 100)}%
            </div>
            <Progress value={(totalCompleted / totalLessons) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {totalCompleted} of {totalLessons} lessons
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Started</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(courseProgress).length}
            </div>
            <p className="text-xs text-muted-foreground">of {courses.length} available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {selectedCourse ? (
            // Course Detail View
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => setSelectedCourse(null)}>
                ← Back to Courses
              </Button>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedCourse.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {selectedCourse.description}
                      </CardDescription>
                    </div>
                    {getLevelBadge(selectedCourse.level)}
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {selectedCourse.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      {selectedCourse.lessons.length} lessons
                    </div>
                    {selectedCourse.certificate && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Award className="h-4 w-4" />
                        Certificate included
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{getCourseProgress(selectedCourse)}%</span>
                    </div>
                    <Progress value={getCourseProgress(selectedCourse)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-4">Course Content</h3>
                  <div className="space-y-2">
                    {selectedCourse.lessons.map((lesson, index) => {
                      const completed = isLessonCompleted(selectedCourse.id, lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            completed ? 'bg-green-50 border-green-200' : 'hover:bg-muted'
                          }`}
                          onClick={() => toggleLessonComplete(selectedCourse.id, lesson.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                completed
                                  ? 'bg-green-500 text-white'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {completed ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <span className="text-sm font-medium">{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {getLessonIcon(lesson.type)}
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            {completed ? 'Completed' : 'Start'}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Course List View
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((course) => {
                const progress = getCourseProgress(course);
                return (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {course.category}
                          </Badge>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {course.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        {getLevelBadge(course.level)}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {course.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons.length} lessons
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                      {course.certificate && (
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-3">
                          <Award className="h-3 w-3" />
                          Certificate on completion
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          {certificates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <Card key={cert.id} className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-bold text-lg">Certificate of Completion</p>
                            <p className="text-sm text-muted-foreground">{cert.courseName}</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Completed:</span>{' '}
                            {cert.completedAt.toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Grade:</span>{' '}
                            <span className="font-medium text-green-600">{cert.grade}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No certificates yet</h3>
                <p className="text-muted-foreground text-center mt-1">
                  Complete courses to earn certificates and showcase your expertise.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
