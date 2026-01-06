
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, BarChart3, TrendingUp, Users, Building, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const MARKET_DATA = [
  { name: 'Jan', sales: 4000, listings: 2400 },
  { name: 'Feb', sales: 3000, listings: 1398 },
  { name: 'Mar', sales: 2000, listings: 9800 },
  { name: 'Apr', sales: 2780, listings: 3908 },
  { name: 'May', sales: 1890, listings: 4800 },
  { name: 'Jun', sales: 2390, listings: 3800 },
];

const PROPERTY_VALUES = [
  { region: 'Nairobi', avgPrice: 15.5 },
  { region: 'Mombasa', avgPrice: 12.2 },
  { region: 'Kisumu', avgPrice: 8.5 },
  { region: 'Nakuru', avgPrice: 6.8 },
  { region: 'Eldoret', avgPrice: 5.4 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin-portal");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin-portal");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-800 border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Activity className="h-6 w-6" />
          <span>Admin Intelligence Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Logged in as Super Admin</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,345</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +5 new this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" /> Requires Action
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Property Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 14.2M</div>
              <p className="text-xs text-muted-foreground mt-1">Based on active listings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Market Activity Trends</CardTitle>
              <CardDescription>Sales vs New Listings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MARKET_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="listings" stroke="#8884d8" name="New Listings" />
                  <Line type="monotone" dataKey="sales" stroke="#82ca9d" name="Sales Closed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Regional Price Insights (Millions KES)</CardTitle>
              <CardDescription>Average property listing price by region</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROPERTY_VALUES}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgPrice" fill="#3b82f6" name="Avg Price (M)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Market Reports</CardTitle>
            <CardDescription>Automated insights collected by the Data Agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Weekly Market Snapshot - Week {i}</p>
                      <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Download PDF</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
