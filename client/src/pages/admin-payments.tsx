import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Users, Phone, Mail, MapPin, Building, Lock, Layout, Palette, CheckCircle, AlertCircle } from "lucide-react";

interface PaymentRequest {
  id: string;
  clientCode: string;
  package: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  address: string;
  city: string;
  postcode: string;
  googleBusinessSetup: boolean;
  templateStyle?: string;
  templateVariation?: string;
  colorScheme?: string;
  layoutPreference?: string;
  status: string;
  projectStatus: string;
  createdAt: string;
}

export default function AdminPaymentsNew() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionPassword, setSessionPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if there's a stored session and verify it
  useEffect(() => {
    const storedSession = localStorage.getItem('admin_session');
    if (storedSession) {
      setSessionPassword(storedSession);
      setIsAuthenticated(true);
      toast({
        title: "Auto-login successful",
        description: "Using your existing admin session",
      });
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
          description: "Welcome to payment management",
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

  const { data: paymentRequests, isLoading, error } = useQuery({
    queryKey: ['/api/admin/payments', sessionPassword],
    enabled: isAuthenticated && !!sessionPassword,
    queryFn: async () => {
      const response = await fetch(`/api/admin/payments?password=${encodeURIComponent(sessionPassword)}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch payment requests');
      }
      
      return result.data as PaymentRequest[];
    },
    retry: false,
  });

  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ requestId, projectStatus }: { requestId: string; projectStatus: string }) => {
      const response = await fetch(`/api/admin/payments/${requestId}/status?password=${encodeURIComponent(sessionPassword)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectStatus }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update project status');
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments', sessionPassword] });
      toast({
        title: "Status Updated",
        description: `Project status changed to ${variables.projectStatus}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionPassword("");
    setPassword("");
    localStorage.removeItem('admin_session');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl">Payment Management Login</CardTitle>
            <CardDescription>Enter your admin password to access payment requests</CardDescription>
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-800 font-medium">
                🔑 Admin Password: <span className="font-mono">BADMAN123</span>
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Use this password to access payment requests and customer data
              </p>
            </div>
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
            <Button 
              variant="outline" 
              onClick={() => window.close()} 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analytics
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
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full"
            >
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
            <h1 className="text-3xl font-bold text-slate-900">Payment Management</h1>
            <p className="text-slate-600 mt-2">Customer payment requests and direct debit setups</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => window.close()} 
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analytics
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
        ) : paymentRequests && paymentRequests.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                    Total Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{paymentRequests.length}</div>
                  <p className="text-xs text-slate-600">Payment requests received</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="w-4 h-4 mr-2 text-emerald-600" />
                    Premium Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">
                    {paymentRequests.filter(req => req.package === 'premium').length}
                  </div>
                  <p className="text-xs text-slate-600">£150 + £10/month</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Building className="w-4 h-4 mr-2 text-orange-600" />
                    Basic Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {paymentRequests.filter(req => req.package === 'basic').length}
                  </div>
                  <p className="text-xs text-slate-600">£50 + £10/month</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Building className="w-4 h-4 mr-2 text-blue-600" />
                    Google Business Add-ons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {paymentRequests.filter(req => req.googleBusinessSetup).length}
                  </div>
                  <p className="text-xs text-slate-600">+£25 each</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Requests List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Customer Payment Requests
                </CardTitle>
                <CardDescription>Direct debit setup requests from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentRequests.map((request, index) => (
                    <Card key={request.id} className="border border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="inline-block px-3 py-1 text-sm font-bold rounded-lg bg-blue-600 text-white shadow-sm">
                                {request.clientCode}
                              </span>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                request.package === 'premium' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {request.package === 'premium' ? 'Premium Package' : 'Basic Package'}
                              </span>
                              <span className="text-slate-500 text-sm">
                                {new Date(request.createdAt).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mt-2">
                              {request.firstName} {request.lastName}
                            </h3>
                            {request.businessName && (
                              <p className="text-slate-600">{request.businessName}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">
                              £{(request.package === 'premium' ? 150 : 50) + (request.googleBusinessSetup ? 25 : 0)}
                            </div>
                            <div className="text-sm text-slate-600">+ £10/month</div>
                            {request.googleBusinessSetup && (
                              <div className="text-xs text-blue-600 font-medium">Includes Google Business (+£25)</div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="text-slate-600">{request.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="text-slate-600">{request.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="text-slate-600">{request.city}, {request.postcode}</span>
                          </div>
                        </div>
                        
                        {/* Add-on Services */}
                        {request.googleBusinessSetup && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Google Business Listing Setup</span>
                              <span className="ml-auto text-sm font-bold text-blue-600">+£25</span>
                            </div>
                            <p className="text-xs text-blue-600 mt-1 ml-6">
                              Customer requested Google Business profile setup and optimization
                            </p>
                          </div>
                        )}

                        {/* Template Selection */}
                        {(request.templateStyle || request.colorScheme || request.layoutPreference) && (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <h4 className="font-medium text-emerald-900 mb-2 flex items-center">
                              <Layout className="w-4 h-4 mr-2" />
                              Template Selection
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              {request.templateStyle && (
                                <div>
                                  <span className="text-emerald-700">Style:</span>
                                  <div className="font-medium px-2 py-1 bg-emerald-100 rounded text-emerald-800 inline-block ml-1">
                                    {request.templateStyle}
                                  </div>
                                </div>
                              )}
                              {request.templateVariation && (
                                <div>
                                  <span className="text-emerald-700">Theme:</span>
                                  <div className="font-medium px-2 py-1 bg-slate-100 rounded text-slate-800 inline-block ml-1 capitalize">
                                    {request.templateVariation}
                                  </div>
                                </div>
                              )}
                              {request.colorScheme && (
                                <div>
                                  <span className="text-emerald-700">Colors:</span>
                                  <div className="font-medium px-2 py-1 bg-blue-100 rounded text-blue-800 inline-block ml-1">
                                    {request.colorScheme}
                                  </div>
                                </div>
                              )}
                              {request.layoutPreference && (
                                <div>
                                  <span className="text-emerald-700">Layout:</span>
                                  <div className="font-medium px-2 py-1 bg-purple-100 rounded text-purple-800 inline-block ml-1">
                                    {request.layoutPreference}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                          <h4 className="font-medium text-slate-900 mb-2">Banking Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Account Holder:</span>
                              <div className="font-medium">{request.accountHolderName}</div>
                            </div>
                            <div>
                              <span className="text-slate-600">Sort Code:</span>
                              <div className="font-medium font-mono">{request.sortCode}</div>
                            </div>
                            <div>
                              <span className="text-slate-600">Account Number:</span>
                              <div className="font-medium font-mono">{request.accountNumber}</div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="text-slate-600">Address:</span>
                            <div className="font-medium">
                              {request.address}, {request.city}, {request.postcode}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-700">Project Status:</span>
                              <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                                request.projectStatus === 'published' ? 'bg-green-100 text-green-800' :
                                request.projectStatus === 'approved' ? 'bg-blue-100 text-blue-800' :
                                request.projectStatus === 'built_awaiting_approval' ? 'bg-purple-100 text-purple-800' :
                                request.projectStatus === 'paid_pending_build' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.projectStatus?.replace(/_/g, ' ') || 'pending_payment'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Request #{index + 1}
                            </div>
                          </div>
                          
                          {/* Status Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {request.projectStatus === 'pending_payment' && (
                              <Button
                                size="sm"
                                onClick={() => updateProjectStatusMutation.mutate({ requestId: request.id, projectStatus: 'paid_pending_build' })}
                                disabled={updateProjectStatusMutation.isPending}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Mark as Paid
                              </Button>
                            )}
                            {request.projectStatus === 'paid_pending_build' && (
                              <Button
                                size="sm"
                                onClick={() => updateProjectStatusMutation.mutate({ requestId: request.id, projectStatus: 'built_awaiting_approval' })}
                                disabled={updateProjectStatusMutation.isPending}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Mark as Built
                              </Button>
                            )}
                            {request.projectStatus === 'built_awaiting_approval' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateProjectStatusMutation.mutate({ requestId: request.id, projectStatus: 'approved' })}
                                  disabled={updateProjectStatusMutation.isPending}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateProjectStatusMutation.mutate({ requestId: request.id, projectStatus: 'paid_pending_build' })}
                                  disabled={updateProjectStatusMutation.isPending}
                                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                                >
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Request Changes
                                </Button>
                              </>
                            )}
                            {request.projectStatus === 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => updateProjectStatusMutation.mutate({ requestId: request.id, projectStatus: 'published' })}
                                disabled={updateProjectStatusMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Publish
                              </Button>
                            )}
                            {request.projectStatus === 'published' && (
                              <div className="flex items-center text-sm text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Project is live!
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Payment Requests Yet</h3>
              <p className="text-slate-600 mb-4">
                Customer payment requests will appear here when they complete the payment setup process.
              </p>
              <p className="text-sm text-slate-500">
                Customers can request direct debit setup through the payment page on your website.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}