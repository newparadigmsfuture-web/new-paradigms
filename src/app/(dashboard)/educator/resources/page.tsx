import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, Link as LinkIcon, Download, ExternalLink, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function EducatorResourcesPage() {
  const supabase = await createClient();

  const { data: resources } = await supabase
    .from('training_resources')
    .select('*, uploader:users(full_name)')
    .contains('access_roles', ['educator'])
    .order('created_at', { ascending: false });

  const documents = resources?.filter((r) => r.type === 'document') || [];
  const videos = resources?.filter((r) => r.type === 'video') || [];
  const links = resources?.filter((r) => r.type === 'link') || [];

  const categories = [...new Set(resources?.map((r) => r.category) || [])];

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'video':
        return Video;
      case 'link':
        return LinkIcon;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Training Resources</h1>
        <p className="text-muted-foreground">
          Access documents, videos, and links to improve your Bitcoin education skills.
        </p>
      </div>

      {resources && resources.length > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({resources.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
            <TabsTrigger value="links">Links ({links.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => {
                const Icon = getIcon(resource.type);
                return (
                  <Card key={resource.id} className="hover:border-primary transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary">{resource.category}</Badge>
                      </div>
                      <CardTitle className="text-lg mt-3">{resource.title}</CardTitle>
                      {resource.description && (
                        <CardDescription className="line-clamp-2">
                          {resource.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          By {(resource.uploader as any)?.full_name}
                        </p>
                        <Button size="sm" asChild>
                          <Link href={resource.file_url} target="_blank">
                            {resource.type === 'link' ? (
                              <>
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Open
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </>
                            )}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((resource) => (
                <Card key={resource.id} className="hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{resource.title}</CardTitle>
                    {resource.description && (
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full" asChild>
                      <Link href={resource.file_url} target="_blank">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((resource) => (
                <Card key={resource.id} className="hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{resource.title}</CardTitle>
                    {resource.description && (
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full" asChild>
                      <Link href={resource.file_url} target="_blank">
                        <Video className="h-4 w-4 mr-1" />
                        Watch
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {links.map((resource) => (
                <Card key={resource.id} className="hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <LinkIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{resource.title}</CardTitle>
                    {resource.description && (
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full" asChild>
                      <Link href={resource.file_url} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No training resources available yet.</p>
              <p className="text-sm">Check back later for new materials.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
