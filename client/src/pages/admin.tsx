import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, MousePointer, Calendar, BarChart3, Activity, Lock, Users, Globe, FileText, Palette, Settings } from "lucide-react";

interface AnalyticsData {
  pageViewStats: { page: string; views: number }[];
  clickEventStats: { element: string; clicks: number }[];
  totalPageViews: number;
  totalClickEvents: number;
  period: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionPassword, setSessionPassword] = useState("");
  const [days, setDays] = useState("30");
  const { toast } = useToast();

  // Check if there's a stored session
  useEffect(() => {
    const storedSession = localStorage.getItem('admin_session');
    if (storedSession) {
      setSessionPassword(storedSession);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
        setSessionPassword(password);
        localStorage.setItem('admin_session', password);
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Invalid password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionPassword("");
    setPassword("");
    localStorage.removeItem('admin_session');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/analytics', sessionPassword, days],
    enabled: isAuthenticated && !!sessionPassword,
    queryFn: async () => {
      const response = await fetch(`/api/admin/analytics?password=${encodeURIComponent(sessionPassword)}&days=${days}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch analytics');
      }
      
      return result.data as AnalyticsData;
    },
    retry: false,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your password to access the analytics dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={!password.trim()}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">Authentication Error</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Login Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">Website analytics, traffic data, and customer management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => window.open('/admin/payments', '_blank')} 
              variant="outline"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              View Payments
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Website Visitors</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{analyticsData.totalPageViews}</div>
                  <p className="text-xs text-slate-600">Total page views in last {days} days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">User Interactions</CardTitle>
                  <MousePointer className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">{analyticsData.totalClickEvents}</div>
                  <p className="text-xs text-slate-600">Button clicks and interactions</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {analyticsData.totalPageViews > 0 
                      ? ((analyticsData.totalClickEvents / analyticsData.totalPageViews) * 100).toFixed(1)
                      : '0.0'
                    }%
                  </div>
                  <p className="text-xs text-slate-600">Average interactions per visit</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Popular Page</CardTitle>
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-orange-600">
                    {analyticsData.pageViewStats[0]?.page === '/' ? 'Homepage' : analyticsData.pageViewStats[0]?.page || 'N/A'}
                  </div>
                  <p className="text-xs text-slate-600">{analyticsData.pageViewStats[0]?.views || 0} total views</p>
                </CardContent>
              </Card>
            </div>

            {/* Essential Client Information Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Essential Client Information Checklist
                </CardTitle>
                <CardDescription>Information needed from clients to set up their website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Essential Client Info */}
                  <div className="border-l-4 border-l-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Essential Client Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium">Full Name</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium">Business / Brand Name</span>
                        <span className="text-slate-600 ml-2">(as it should appear on the site)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium">Email</span>
                        <span className="text-slate-600 ml-2">(for account, billing, and updates)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-slate-300 rounded-full mr-3"></div>
                        <span className="font-medium">Phone number</span>
                        <span className="text-slate-500 ml-2">(optional, for contact if needed)</span>
                      </div>
                    </div>
                  </div>

                  {/* Domain & Hosting */}
                  <div className="border-l-4 border-l-emerald-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-emerald-600" />
                      Domain & Hosting
                      <span className="text-sm text-emerald-600 font-normal ml-2">(only needed for £150 plan)</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        <span className="font-medium">Do you already have a domain name?</span>
                      </div>
                      <div className="ml-5 space-y-1 text-slate-600">
                        <div>• If yes → Please provide the domain</div>
                        <div>• If no → What domain name(s) would you like? (list 2–3 options in case the first isn't available)</div>
                      </div>
                    </div>
                  </div>

                  {/* Website Content */}
                  <div className="border-l-4 border-l-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-600" />
                      Website Content
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="font-medium">About your business/brand</span>
                        <span className="text-slate-600 ml-2">(short description for "About Us" section)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="font-medium">Pages you need</span>
                        <span className="text-slate-600 ml-2">(e.g. Home, About, Services, Contact, Gallery)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="font-medium">Text content</span>
                        <span className="text-slate-600 ml-2">(they can paste it in or upload a file)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-slate-300 rounded-full mr-3"></div>
                        <span className="font-medium">Images / Logo upload</span>
                        <span className="text-slate-500 ml-2">(optional: let them send via email if easier)</span>
                      </div>
                    </div>
                  </div>

                  {/* Design Preferences */}
                  <div className="border-l-4 border-l-orange-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Palette className="w-5 h-5 mr-2 text-orange-600" />
                      Design Preferences
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="font-medium">Do you have a logo?</span>
                        <span className="text-slate-600 ml-2">(Upload option)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="font-medium">Preferred colour scheme / style</span>
                        <span className="text-slate-600 ml-2">(e.g. modern, professional, playful, minimal)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="font-medium">Example websites you like</span>
                        <span className="text-slate-600 ml-2">(links for inspiration)</span>
                      </div>
                    </div>
                  </div>

                  {/* Extras */}
                  <div className="border-l-4 border-l-pink-500 pl-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-pink-600" />
                      Extras
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                        <span className="font-medium">Do you want a contact form on the site?</span>
                        <span className="text-slate-600 ml-2">(yes/no)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                        <span className="font-medium">Do you want links to social media profiles?</span>
                        <span className="text-slate-600 ml-2">(Facebook, Instagram, LinkedIn, etc.)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                        <span className="font-medium">Any special requests?</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700">
                      <strong>💡 Tip:</strong> Use this checklist when onboarding new clients to ensure you collect all necessary information for their website setup. 
                      Save time by sending this list to clients before your initial consultation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Click Events Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MousePointer className="w-5 h-5 mr-2" />
                  Click Events by Element
                </CardTitle>
                <CardDescription>Most clicked buttons and links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.clickEventStats.length > 0 ? (
                    analyticsData.clickEventStats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-secondary">{index + 1}</span>
                          </div>
                          <span className="font-medium">{stat.element}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <div className="text-lg font-bold">{stat.clicks}</div>
                            <div className="text-xs text-muted-foreground">clicks</div>
                          </div>
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-secondary rounded-full"
                              style={{ 
                                width: `${(stat.clicks / Math.max(...analyticsData.clickEventStats.map(s => s.clicks))) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No click event data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}