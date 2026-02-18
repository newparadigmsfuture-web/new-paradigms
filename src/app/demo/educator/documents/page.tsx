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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileSignature,
  FileText,
  Upload,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  PenTool,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'agreement' | 'form' | 'template';
  status: 'draft' | 'sent' | 'signed' | 'expired';
  recipient?: string;
  recipientEmail?: string;
  createdAt: Date;
  signedAt?: Date;
  expiresAt?: Date;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  popular?: boolean;
}

const STORAGE_KEY = 'demo_documents';

const templates: Template[] = [
  {
    id: '1',
    name: 'Client Service Agreement',
    description: 'Standard agreement for Bitcoin education services',
    category: 'Contracts',
    popular: true,
  },
  {
    id: '2',
    name: 'BE Onboarding Contract',
    description: 'Contract for new Bitcoin Educators joining the team',
    category: 'Contracts',
    popular: true,
  },
  {
    id: '3',
    name: 'Non-Disclosure Agreement',
    description: 'Standard NDA for confidential information',
    category: 'Legal',
  },
  {
    id: '4',
    name: 'Session Feedback Form',
    description: 'Post-session feedback collection form',
    category: 'Forms',
  },
  {
    id: '5',
    name: 'Client Intake Form',
    description: 'Initial client information collection',
    category: 'Forms',
    popular: true,
  },
  {
    id: '6',
    name: 'Referral Agreement',
    description: 'Agreement for referral partners',
    category: 'Partnerships',
  },
];

function getStoredDocuments(): Document[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: Document[] = [
      {
        id: '1',
        name: 'Client Service Agreement - John Smith',
        type: 'contract',
        status: 'signed',
        recipient: 'John Smith',
        recipientEmail: 'john@example.com',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        signedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        name: 'BE Onboarding Contract - Sarah Johnson',
        type: 'contract',
        status: 'sent',
        recipient: 'Sarah Johnson',
        recipientEmail: 'sarah@example.com',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        name: 'NDA - Michael Brown',
        type: 'agreement',
        status: 'signed',
        recipient: 'Michael Brown',
        recipientEmail: 'michael@example.com',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        signedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        name: 'Client Intake - Emily Davis',
        type: 'form',
        status: 'draft',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        name: 'Service Agreement - David Wilson',
        type: 'contract',
        status: 'expired',
        recipient: 'David Wilson',
        recipientEmail: 'david@example.com',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored).map((d: any) => ({
    ...d,
    createdAt: new Date(d.createdAt),
    signedAt: d.signedAt ? new Date(d.signedAt) : undefined,
    expiresAt: d.expiresAt ? new Date(d.expiresAt) : undefined,
  }));
}

function saveDocuments(documents: Document[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isNewDocDialogOpen, setIsNewDocDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newDocForm, setNewDocForm] = useState({
    recipient: '',
    recipientEmail: '',
  });

  useEffect(() => {
    setDocuments(getStoredDocuments());
  }, []);

  const signedCount = documents.filter((d) => d.status === 'signed').length;
  const pendingCount = documents.filter((d) => d.status === 'sent').length;
  const draftCount = documents.filter((d) => d.status === 'draft').length;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'signed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" /> Signed
          </Badge>
        );
      case 'sent':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" /> Awaiting Signature
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary">
            <FileText className="mr-1 h-3 w-3" /> Draft
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" /> Expired
          </Badge>
        );
    }
  };

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsNewDocDialogOpen(true);
  };

  const handleCreateDocument = () => {
    if (!selectedTemplate || !newDocForm.recipient || !newDocForm.recipientEmail) return;

    const newDoc: Document = {
      id: Date.now().toString(),
      name: `${selectedTemplate.name} - ${newDocForm.recipient}`,
      type: selectedTemplate.category === 'Forms' ? 'form' : 'contract',
      status: 'draft',
      recipient: newDocForm.recipient,
      recipientEmail: newDocForm.recipientEmail,
      createdAt: new Date(),
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveDocuments(updated);
    setIsNewDocDialogOpen(false);
    setNewDocForm({ recipient: '', recipientEmail: '' });
    setSelectedTemplate(null);
  };

  const handleSendDocument = (doc: Document) => {
    const updated = documents.map((d) =>
      d.id === doc.id
        ? {
            ...d,
            status: 'sent' as const,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          }
        : d
    );
    setDocuments(updated);
    saveDocuments(updated);
  };

  const handleDeleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    saveDocuments(updated);
  };

  const filteredDocuments = documents.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents & E-Signatures</h1>
          <p className="text-muted-foreground">
            Create, send, and manage documents with electronic signatures
          </p>
        </div>
        <Button onClick={() => setIsNewDocDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{signedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Signature</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Documents</CardTitle>
                  <CardDescription>Manage your contracts and agreements</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileSignature className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.recipient ? (
                          <div>
                            <p className="font-medium">{doc.recipient}</p>
                            <p className="text-xs text-muted-foreground">{doc.recipientEmail}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(doc.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {doc.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSendDocument(doc)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {doc.status === 'signed' && (
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {template.category}
                      </Badge>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    {template.popular && (
                      <Badge className="bg-primary/10 text-primary">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* DocuSign Integration Notice */}
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileSignature className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium">Connect DocuSign</h4>
              <p className="text-sm text-muted-foreground">
                Enable legally binding e-signatures with DocuSign integration
              </p>
            </div>
          </div>
          <Button>Connect DocuSign</Button>
        </CardContent>
      </Card>

      {/* New Document Dialog */}
      <Dialog open={isNewDocDialogOpen} onOpenChange={setIsNewDocDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              {selectedTemplate
                ? `Create a new ${selectedTemplate.name}`
                : 'Select a template to get started'}
            </DialogDescription>
          </DialogHeader>
          {!selectedTemplate ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 rounded-lg border hover:bg-muted cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <p className="font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium">{selectedTemplate.name}</p>
                <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Name</Label>
                <Input
                  id="recipient"
                  value={newDocForm.recipient}
                  onChange={(e) => setNewDocForm({ ...newDocForm, recipient: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={newDocForm.recipientEmail}
                  onChange={(e) =>
                    setNewDocForm({ ...newDocForm, recipientEmail: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewDocDialogOpen(false);
                setSelectedTemplate(null);
              }}
            >
              Cancel
            </Button>
            {selectedTemplate && (
              <Button onClick={handleCreateDocument}>Create Document</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
