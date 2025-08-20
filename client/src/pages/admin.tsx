import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, MousePointer, Calendar, BarChart3, Activity, Lock, Users, Globe, FileText, Palette, Settings, User, TrendingUp, Target, DollarSign, Percent, MessageSquare, Calculator, Check, Clock } from "lucide-react";

interface AnalyticsData {
  pageViewStats: { page: string; views: number }[];
  clickEventStats: { element: string; clicks: number }[];
  totalPageViews: number;
  totalClickEvents: number;
  uniqueVisitors: number;
  period: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionPassword, setSessionPassword] = useState("");
  const [days, setDays] = useState("30");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate days since request
  const getDaysWaiting = (createdAt: string) => {
    const requestDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - requestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

  // Consultation requests data query
  const { data: consultationData } = useQuery({
    queryKey: ['/api/admin/consultations', sessionPassword],
    enabled: isAuthenticated && !!sessionPassword,
    queryFn: async () => {
      const response = await fetch(`/api/admin/consultations?password=${encodeURIComponent(sessionPassword)}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch consultation data');
      }
      
      return result.data;
    },
    retry: false,
  });

  // Mutation for updating client status
  const updateClientStatusMutation = useMutation({
    mutationFn: async ({ clientId, status }: { clientId: string; status: string }) => {
      const response = await fetch(`/api/admin/client-onboarding/${clientId}/status?password=${encodeURIComponent(sessionPassword)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update status');
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/client-onboarding'] });
      toast({
        title: "Status updated",
        description: `Client request has been ${variables.status}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating consultation status
  const updateConsultationStatusMutation = useMutation({
    mutationFn: async ({ consultationId, status }: { consultationId: string; status: string }) => {
      const response = await fetch(`/api/admin/consultations/${consultationId}/status?password=${encodeURIComponent(sessionPassword)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update consultation status');
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/consultations'] });
      toast({
        title: "Consultation status updated",
        description: `Consultation has been ${variables.status}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Lock className="w-5 h-5 mr-2" />
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your admin password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Login Again
            </Button>
          </div>
        </div>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics">Website Analytics</TabsTrigger>
              <TabsTrigger value="conversion">Sales Conversion</TabsTrigger>
              <TabsTrigger value="clients">Client Inquiries</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Website Visitors</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{analyticsData.uniqueVisitors}</div>
                  <p className="text-xs text-slate-600">Unique people who visited main website</p>
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
                    <Users className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{analyticsData.uniqueVisitors}</div>
                    <p className="text-xs text-slate-600">Unique people who visited main website</p>
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
                      {analyticsData.uniqueVisitors > 0 
                        ? (((paymentData?.length || 0) / analyticsData.uniqueVisitors) * 100).toFixed(1)
                        : '0.0'
                      }%
                    </div>
                    <p className="text-xs text-slate-600">Visitors to payment conversion</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      £{paymentData ? paymentData.reduce((total: number, payment: any) => {
                        const setupFee = payment.selectedPackage === 'premium' ? 150 : 50;
                        return total + setupFee;
                      }, 0) : 0}
                    </div>
                    <p className="text-xs text-slate-600">Total setup fees from requests</p>
                  </CardContent>
                </Card>
              </div>
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
                      {clientData
                        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) 
                        .map((client: any) => {
                          const daysWaiting = getDaysWaiting(client.createdAt);
                          const isPriority = daysWaiting >= 3;
                          
                          return (
                            <div key={client.id} className={`border rounded-lg p-6 ${
                              isPriority ? 'bg-red-50 border-red-200' : 'bg-slate-50'
                            }`}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold text-slate-900">{client.fullName}</h3>
                                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    isPriority 
                                      ? 'bg-red-100 text-red-800' 
                                      : daysWaiting >= 2
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {daysWaiting} day{daysWaiting !== 1 ? 's' : ''} waiting
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    client.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    client.status === 'delayed' ? 'bg-orange-100 text-orange-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {client.status || 'new'}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-slate-500">
                                    {new Date(client.createdAt).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  {client.status !== 'accepted' && client.status !== 'delayed' && (
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() => updateClientStatusMutation.mutate({ clientId: client.id, status: 'accepted' })}
                                        disabled={updateClientStatusMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        <Check className="w-4 h-4 mr-1" />
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateClientStatusMutation.mutate({ clientId: client.id, status: 'delayed' })}
                                        disabled={updateClientStatusMutation.isPending}
                                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                                      >
                                        <Clock className="w-4 h-4 mr-1" />
                                        Delay
                                      </Button>
                                    </div>
                                  )}
                                </div>
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
                          );
                        })}
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

            {/* Consultations Tab */}
            <TabsContent value="consultations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Custom Project Consultations
                  </CardTitle>
                  <CardDescription>
                    Review consultation requests from the custom pricing configurator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {consultationData && consultationData.length > 0 ? (
                    <div className="space-y-6">
                      {consultationData
                        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        .map((consultation: any, index: number) => {
                          const daysWaiting = getDaysWaiting(consultation.createdAt);
                          const isPriority = daysWaiting >= 3;
                          
                          return (
                            <div key={index} className={`border rounded-lg p-6 ${
                              isPriority ? 'bg-red-50 border-red-200' : 'bg-slate-50'
                            }`}>
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                      {consultation.fullName}
                                    </h3>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      isPriority 
                                        ? 'bg-red-100 text-red-800' 
                                        : daysWaiting >= 2
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {daysWaiting} day{daysWaiting !== 1 ? 's' : ''} waiting
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      consultation.status === 'quoted' ? 'bg-green-100 text-green-800' :
                                      consultation.status === 'delayed' ? 'bg-orange-100 text-orange-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {consultation.status || 'pending'}
                                    </div>
                                  </div>
                                  <p className="text-slate-600">{consultation.businessName}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                                    <span>📧 {consultation.email}</span>
                                    <span>📞 {consultation.phone}</span>
                                    <span>📅 {new Date(consultation.createdAt).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-emerald-600">
                                    £{consultation.estimatedPrice}
                                  </div>
                                  <div className="text-sm text-slate-500 mb-2">Estimated Quote</div>
                                  {consultation.status !== 'quoted' && consultation.status !== 'delayed' && (
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() => updateConsultationStatusMutation.mutate({ consultationId: consultation.id, status: 'quoted' })}
                                        disabled={updateConsultationStatusMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        <Check className="w-4 h-4 mr-1" />
                                        Send Quote
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateConsultationStatusMutation.mutate({ consultationId: consultation.id, status: 'delayed' })}
                                        disabled={updateConsultationStatusMutation.isPending}
                                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                                      >
                                        <Clock className="w-4 h-4 mr-1" />
                                        Delay
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid md:grid-cols-3 gap-6">
                                {/* Project Configuration */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-slate-800 border-b pb-1">Project Configuration</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Service Type:</span> {consultation.serviceType}</p>
                                    <p><span className="font-medium">Complexity:</span> {consultation.projectComplexity}</p>
                                    <p><span className="font-medium">Timeline:</span> {consultation.timeline}</p>
                                  </div>
                                </div>

                                {/* Additional Services */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-slate-800 border-b pb-1">Additional Services</h4>
                                  <div className="space-y-1 text-sm">
                                    {consultation.seoSetup && <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> SEO Setup</div>}
                                    {consultation.contentWriting && <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> Content Writing</div>}
                                    {consultation.ongoingSupport && <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> Ongoing Support</div>}
                                    {consultation.customIntegrations && <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> Custom Integrations</div>}
                                    {consultation.ecommerceFeatures && <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> E-commerce Features</div>}
                                  </div>
                                </div>

                                {/* Project Details */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-slate-800 border-b pb-1">Project Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="font-medium">Description:</span>
                                      <p className="text-slate-700 mt-1">{consultation.projectDescription}</p>
                                    </div>
                                    {consultation.specialRequests && (
                                      <div>
                                        <span className="font-medium">Special Requests:</span>
                                        <p className="text-slate-700 mt-1">{consultation.specialRequests}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calculator className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 mb-2">No consultation requests yet</p>
                      <p className="text-sm text-slate-500">
                        When clients use the custom pricing configurator, their requests will appear here.
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