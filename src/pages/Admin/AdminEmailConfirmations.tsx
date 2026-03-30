
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Mail, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

type EmailSession = {
  id: string;
  clerk_user_id: string;
  email: string;
  role: string;
  status: string;
  confirmation_token: string;
  email_sent_at: string | null;
  email_opened_at: string | null;
  clicked_at: string | null;
  expires_at: string;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: 'bg-yellow-500', icon: Clock },
  sent: { color: 'bg-blue-500', icon: Mail },
  opened: { color: 'bg-purple-500', icon: Mail },
  clicked: { color: 'bg-green-500', icon: CheckCircle },
  expired: { color: 'bg-red-500', icon: AlertCircle },
};

const ROLE_COLORS: Record<string, string> = {
  agent: 'bg-blue-500',
  host: 'bg-purple-500',
  professional: 'bg-orange-500',
};

export default function AdminEmailConfirmations() {
  const [sessions, setSessions] = useState<EmailSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_confirmation_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load email confirmation sessions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchQuery === '' || 
      session.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.clerk_user_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || session.role === filterRole;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return '-';
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const stats = {
    total: sessions.length,
    pending: sessions.filter(s => s.status === 'pending').length,
    sent: sessions.filter(s => s.status === 'sent').length,
    clicked: sessions.filter(s => s.status === 'clicked').length,
    expired: sessions.filter(s => s.status === 'expired').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Confirmations</h2>
          <p className="text-muted-foreground">
            Track branded email confirmations for agent/host/professional sign-ups
          </p>
        </div>
        <Button onClick={fetchSessions} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <p className="text-xs text-muted-foreground">Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.clicked}</div>
            <p className="text-xs text-muted-foreground">Clicked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="agent">Agent</option>
              <option value="host">Host</option>
              <option value="professional">Professional</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="opened">Opened</option>
              <option value="clicked">Clicked</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Confirmation Sessions</CardTitle>
          <CardDescription>
            Showing {filteredSessions.length} of {sessions.length} sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No confirmation sessions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => {
                  const StatusIcon = STATUS_CONFIG[session.status]?.icon || Clock;
                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{session.email}</span>
                          <span className="text-xs text-muted-foreground">
                            {session.clerk_user_id.slice(0, 8)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={ROLE_COLORS[session.role]}>
                          {session.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(session.email_sent_at)}</span>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(session.email_sent_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {session.email_opened_at ? (
                          <span className="text-green-600">{getTimeAgo(session.email_opened_at)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {session.clicked_at ? (
                          <span className="text-green-600">{getTimeAgo(session.clicked_at)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {formatDate(session.expires_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://savanah-dwelling.co.ke/email-confirmed?token=${session.confirmation_token}`
                            );
                            toast.success('Link copied!');
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
