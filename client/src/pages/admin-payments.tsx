import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Users, Phone, Mail, MapPin, Building } from "lucide-react";

interface PaymentRequest {
  id: string;
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
  status: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionPassword, setSessionPassword] = useState("");
  const { toast } = useToast();

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
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
              onClick={() => {
                setIsAuthenticated(false);
                setSessionPassword("");
                setPassword("");
                localStorage.removeItem('admin_session');
              }} 
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

  const getPackageDetails = (pkg: string) => {
    const packages = {
      basic: { name: "Basic Static Website", setupFee: "£50", color: "bg-slate-100 text-slate-800" },
      premium: { name: "Premium Hosting & Domain", setupFee: "£150", color: "bg-emerald-100 text-emerald-800" }
    };
    return packages[pkg as keyof typeof packages] || { name: pkg, setupFee: "Unknown", color: "bg-gray-100 text-gray-800" };
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800", 
      active: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment Requests</h1>
            <p className="text-slate-600 mt-2">Manage customer payment requests and direct debit setups</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => window.close()} 
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analytics
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paymentRequests.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {paymentRequests.filter(req => req.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    £{paymentRequests.reduce((total, req) => {
                      return total + (req.package === 'premium' ? 150 : 50);
                    }, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Requests List */}
            <div className="space-y-4">
              {paymentRequests.map((request) => {
                const packageDetails = getPackageDetails(request.package);
                return (
                  <Card key={request.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {request.firstName} {request.lastName}
                          </h3>
                          <p className="text-slate-600">{request.businessName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${packageDetails.color}`}>
                          {packageDetails.name}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {/* Contact Information */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Contact Details
                        </h4>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-2" />
                            <a href={`mailto:${request.email}`} className="text-emerald-600 hover:underline">
                              {request.email}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-2" />
                            <a href={`tel:${request.phone}`} className="text-emerald-600 hover:underline">
                              {request.phone}
                            </a>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="w-3 h-3 mr-2 mt-0.5" />
                            <span>{request.address}, {request.city}, {request.postcode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Banking Information */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Banking Details
                        </h4>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div><strong>Account Holder:</strong> {request.accountHolderName}</div>
                          <div><strong>Sort Code:</strong> {request.sortCode}</div>
                          <div><strong>Account Number:</strong> ****{request.accountNumber.slice(-4)}</div>
                        </div>
                      </div>

                      {/* Package Information */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Package Details
                        </h4>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div><strong>Setup Fee:</strong> {packageDetails.setupFee}</div>
                          <div><strong>Monthly:</strong> £10</div>
                          <div><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString('en-GB')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const subject = `Website Development Project - ${request.businessName}`;
                          const body = `Hi ${request.firstName},\n\nThank you for your interest in our ${packageDetails.name} package.\n\nI'll be in touch shortly to discuss your project requirements.\n\nBest regards,\nwrwebsites Team`;
                          window.open(`mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                        }}
                      >
                        Email Customer
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`tel:${request.phone}`)}
                      >
                        Call Customer
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Payment Requests Yet</h3>
              <p className="text-slate-600">Payment requests will appear here when customers complete the signup process.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}