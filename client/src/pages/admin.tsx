import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, MousePointer, Calendar, BarChart3, Activity, Lock, Users, Globe, FileText, Palette, Settings, User, TrendingUp, Target, DollarSign, Percent } from "lucide-react";

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

  // Client onboarding data query
  const { data: clientData } = useQuery({
    queryKey: ['/api/admin/client-onboarding', sessionPassword],
    enabled: isAuthenticated && !!sessionPassword,
    queryFn: async () => {
      const response = await fetch(`/api/admin/client-onboarding?password=${encodeURIComponent(sessionPassword)}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch client data');
      }
      
      return result.data;
    },
    retry: false,
  });

  // Payment requests data query for conversion tracking
  const { data: paymentData } = useQuery({
    queryKey: ['/api/admin/payments', sessionPassword],
    enabled: isAuthenticated && !!sessionPassword,
    queryFn: async () => {
      const response = await fetch(`/api/admin/payments?password=${encodeURIComponent(sessionPassword)}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch payment data');
      }
      
      return result.data;
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
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics">Website Analytics</TabsTrigger>
              <TabsTrigger value="conversion">Sales Conversion</TabsTrigger>
              <TabsTrigger value="clients">Client Inquiries</TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
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

              {/* Page Views and Click Events Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Page Views */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Page Views
                    </CardTitle>
                    <CardDescription>Most visited pages on your website</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.pageViewStats.map((page, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {page.page === '/' ? 'Homepage' : page.page}
                          </span>
                          <span className="text-sm text-slate-600">{page.views} views</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Click Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MousePointer className="w-5 h-5 mr-2" />
                      Click Events
                    </CardTitle>
                    <CardDescription>Most clicked elements and buttons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.clickEventStats.map((click, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{click.element}</span>
                          <span className="text-sm text-slate-600">{click.clicks} clicks</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sales Conversion Tab */}
            <TabsContent value="conversion" className="space-y-6">
              {/* Conversion Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                    <Eye className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{analyticsData.totalPageViews}</div>
                    <p className="text-xs text-slate-600">Unique website visitors</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Payment Requests</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{paymentData?.length || 0}</div>
                    <p className="text-xs text-slate-600">Customers who started payment</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Percent className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {analyticsData.totalPageViews > 0 && paymentData
                        ? ((paymentData.length / analyticsData.totalPageViews) * 100).toFixed(2)
                        : '0.00'
                      }%
                    </div>
                    <p className="text-xs text-slate-600">Visitors to payment rate</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      £{paymentData?.reduce((total: number, payment: any) => {
                        return total + (payment.package === 'premium' ? 150 : 50);
                      }, 0) || 0}
                    </div>
                    <p className="text-xs text-slate-600">Total setup fees pending</p>
                  </CardContent>
                </Card>
              </div>

              {/* Conversion Funnel Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Sales Funnel Analysis
                  </CardTitle>
                  <CardDescription>Track how visitors move through your sales process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Funnel Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{analyticsData.totalPageViews}</div>
                        <div className="text-sm text-slate-600">Website Visitors</div>
                        <div className="text-xs text-slate-500 mt-1">100% of traffic</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {analyticsData.clickEventStats.find(click => click.element.includes('Get Started') || click.element.includes('pricing'))?.clicks || 0}
                        </div>
                        <div className="text-sm text-slate-600">Interested Visitors</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {analyticsData.totalPageViews > 0 
                            ? ((analyticsData.clickEventStats.find(click => click.element.includes('Get Started') || click.element.includes('pricing'))?.clicks || 0) / analyticsData.totalPageViews * 100).toFixed(1)
                            : '0.0'
                          }% clicked pricing/get started
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{paymentData?.length || 0}</div>
                        <div className="text-sm text-slate-600">Payment Requests</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {analyticsData.totalPageViews > 0 && paymentData
                            ? ((paymentData.length / analyticsData.totalPageViews) * 100).toFixed(2)
                            : '0.00'
                          }% conversion rate
                        </div>
                      </div>
                    </div>

                    {/* Package Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-slate-800 mb-3">Basic Package (£50)</h4>
                        <div className="text-3xl font-bold text-blue-600">
                          {paymentData?.filter((p: any) => p.package === 'basic').length || 0}
                        </div>
                        <p className="text-sm text-slate-600">requests</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-slate-800 mb-3">Premium Package (£150)</h4>
                        <div className="text-3xl font-bold text-purple-600">
                          {paymentData?.filter((p: any) => p.package === 'premium').length || 0}
                        </div>
                        <p className="text-sm text-slate-600">requests</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Client Inquiries Tab */}
            <TabsContent value="clients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Client Project Inquiries
                  </CardTitle>
                  <CardDescription>Information from potential clients who filled out the project form</CardDescription>
                </CardHeader>
                <CardContent>
                  {clientData && clientData.length > 0 ? (
                    <div className="space-y-6">
                      {clientData.map((client: any, index: number) => (
                        <div key={client.id} className="border rounded-lg p-6 bg-slate-50">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">{client.fullName}</h3>
                            <span className="text-sm text-slate-500">
                              {new Date(client.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div className="space-y-3">
                              <h4 className="font-medium text-slate-800 border-b pb-1">Contact Details</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Business:</span> {client.businessName}</p>
                                <p><span className="font-medium">Email:</span> {client.email}</p>
                                <p><span className="font-medium">Phone:</span> {client.phone}</p>
                              </div>
                            </div>

                            {/* Domain & Hosting */}
                            <div className="space-y-3">
                              <h4 className="font-medium text-slate-800 border-b pb-1">Domain & Hosting</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Has Domain:</span> {client.hasDomain || 'Not specified'}</p>
                                <p><span className="font-medium">Domain Name:</span> {client.domainName || 'Not provided'}</p>
                                <p><span className="font-medium">Has Hosting:</span> {client.hasHosting || 'Not specified'}</p>
                                <p><span className="font-medium">Hosting Provider:</span> {client.hostingProvider || 'Not provided'}</p>
                                <p><span className="font-medium">Want Setup Help:</span> {client.wantSetupHelp || 'Not specified'}</p>
                              </div>
                            </div>

                            {/* Website Content */}
                            <div className="space-y-3">
                              <h4 className="font-medium text-slate-800 border-b pb-1">Content Information</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Business Description:</span>
                                  <p className="text-slate-700 mt-1">{client.businessDescription || 'Not provided'}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Services/Products:</span>
                                  <p className="text-slate-700 mt-1">{client.servicesProducts || 'Not provided'}</p>
                                </div>
                              </div>
                            </div>

                            {/* Design & Extras */}
                            <div className="space-y-3">
                              <h4 className="font-medium text-slate-800 border-b pb-1">Design & Features</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Brand Colors:</span> {client.brandColors || 'Not provided'}</p>
                                <p><span className="font-medium">Style Preference:</span> {client.stylePreference || 'Not provided'}</p>
                                <p><span className="font-medium">Want Contact Form:</span> {client.wantContactForm || 'Not specified'}</p>
                                <p><span className="font-medium">Want Social Links:</span> {client.wantSocialLinks || 'Not specified'}</p>
                                {client.specialRequests && (
                                  <div>
                                    <span className="font-medium">Special Requests:</span>
                                    <p className="text-slate-700 mt-1">{client.specialRequests}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 mb-2">No client inquiries yet</p>
                      <p className="text-sm text-slate-500">
                        When clients fill out the "Get Started" form on your website, their information will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : null}
      </div>
    </div>
  );
}