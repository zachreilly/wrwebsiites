import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Eye, MousePointer, Calendar, BarChart3, Activity, Lock, Users, Globe, FileText, Palette, Settings, User, TrendingUp, Target, DollarSign, Percent, MessageSquare, Calculator, Check, Clock, ExternalLink, Bell, AlertCircle, Download, Plus, Home, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AnalyticsData {
  pageViewStats: { page: string; views: number }[];
  clickEventStats: { element: string; clicks: number }[];
  totalPageViews: number;
  totalClickEvents: number;
  uniqueVisitors: number;
  period: string;
}

// Post Update Dialog Component
function PostUpdateDialog({ clientCode, clientName, clientEmail, sessionPassword, toast, queryClient }: {
  clientCode: string;
  clientName: string;
  clientEmail: string;
  sessionPassword: string;
  toast: any;
  queryClient: any;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10485760) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handlePostUpdate = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send to the customer",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    
    try {
      let uploadedImageUrl = null;

      // Upload image if selected
      if (selectedImage) {
        setIsUploading(true);
        try {
          // Validate file type
          if (!selectedImage.type.startsWith('image/')) {
            throw new Error("Please select a valid image file");
          }

          // Get presigned upload URL
          const uploadUrlResponse = await fetch(`/api/admin/project-update-image-upload?password=${encodeURIComponent(sessionPassword)}`, {
            method: 'POST',
          });
          const uploadUrlData = await uploadUrlResponse.json();

          if (!uploadUrlData.success) {
            throw new Error("Failed to get upload URL");
          }

          // Upload image to object storage
          const uploadResponse = await fetch(uploadUrlData.uploadURL, {
            method: 'PUT',
            body: selectedImage,
            headers: {
              'Content-Type': selectedImage.type,
            },
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image to storage");
          }

          // Extract the full GCS URL without query parameters
          uploadedImageUrl = uploadUrlData.uploadURL.split('?')[0];
        } catch (error: any) {
          console.error("Image upload error:", error);
          toast({
            title: "Image Upload Failed",
            description: error.message || "Posting update without image",
            variant: "destructive",
          });
          // Reset image state on failure
          setSelectedImage(null);
          setImagePreview(null);
        } finally {
          setIsUploading(false);
        }
      }

      // Get all customers to find the one linked to this client onboarding
      const customersResponse = await fetch(`/api/admin/customers?password=${encodeURIComponent(sessionPassword)}`);
      const customersData = await customersResponse.json();
      
      if (!customersData.success) {
        throw new Error("Failed to fetch customers");
      }
      
      // Find customer by email or client code
      const customer = customersData.data?.find((c: any) => 
        c.email?.toLowerCase() === clientEmail?.toLowerCase() || c.clientCode === clientCode
      );
      
      if (!customer) {
        throw new Error("Customer account not found. Make sure the customer account has been created using the 'Create Project' button first.");
      }

      // Post the update
      const response = await fetch(`/api/admin/project-update?password=${encodeURIComponent(sessionPassword)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customer.id,
          message: message.trim(),
          imageUrl: uploadedImageUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Update Posted",
          description: `Update sent to ${clientName} (${clientCode})`,
        });
        setMessage("");
        setSelectedImage(null);
        setImagePreview(null);
        setOpen(false);
      } else {
        throw new Error(result.message || 'Failed to post update');
      }
    } catch (error: any) {
      toast({
        title: "Post Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
          data-testid={`button-post-update-${clientCode}`}
        >
          <Send className="w-4 h-4 mr-1" />
          Post Update
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Post Update to {clientName}</DialogTitle>
          <DialogDescription>
            Send a project update notification to {clientCode}. They'll see this in their customer dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <Textarea
              placeholder="e.g., Your website design is in progress, We've completed your homepage mockup, Your site is ready for review..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              data-testid="textarea-update-message"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Screenshot / Image (Optional)
            </label>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full rounded-lg border border-gray-200 max-h-64 object-contain"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                    data-testid="button-remove-image"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                    data-testid="input-image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-gray-500">
                      <p className="font-medium">Click to upload image</p>
                      <p className="text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPosting}
              data-testid="button-cancel-update"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePostUpdate}
              disabled={isPosting || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-send-update"
            >
              {isUploading ? "Uploading..." : isPosting ? "Posting..." : "Post Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionPassword, setSessionPassword] = useState("");
  const [days, setDays] = useState("30");
  const { toast} = useToast();
  const queryClient = useQueryClient();

  // Fetch payment requests for notifications
  const { data: paymentRequests } = useQuery({
    queryKey: ['/api/admin/payments'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/payments?password=${sessionPassword}`);
      return response.json();
    },
    enabled: !!sessionPassword && isAuthenticated,
    refetchInterval: 30000, // Check every 30 seconds for new payments
  });

  // Calculate days since request
  const getDaysWaiting = (createdAt: string) => {
    const requestDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - requestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate new payment notifications
  const getNewPaymentCount = () => {
    if (!paymentRequests?.success || !paymentRequests?.data) return 0;
    
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return paymentRequests.data.filter((payment: any) => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate > oneDayAgo;
    }).length;
  };

  const newPaymentCount = getNewPaymentCount();

  // Show toast notification for new payments
  useEffect(() => {
    if (newPaymentCount > 0 && isAuthenticated) {
      toast({
        title: "🎉 New Payment Request!",
        description: `You have ${newPaymentCount} new payment request${newPaymentCount !== 1 ? 's' : ''} from potential customers`,
        duration: 5000,
      });
    }
  }, [newPaymentCount, isAuthenticated, toast]);

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

  // Website updates data query
  const { data: websiteUpdatesData } = useQuery({
    queryKey: ['/api/admin/website-updates', sessionPassword],
    enabled: isAuthenticated && !!sessionPassword,
    queryFn: async () => {
      const response = await fetch(`/api/admin/website-updates?password=${encodeURIComponent(sessionPassword)}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch website updates data');
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

  // Mutation for updating website update status
  const updateWebsiteUpdateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/website-updates/${id}/status?password=${encodeURIComponent(sessionPassword)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update website update status');
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/website-updates'] });
      toast({
        title: "Website update status updated",
        description: `Request has been marked as ${variables.status}`,
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
              className="bg-emerald-600 text-white hover:bg-emerald-700 relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              View Payments
              {newPaymentCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {newPaymentCount}
                </span>
              )}
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="outline"
              data-testid="button-home"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* New Payment Notifications */}
        {newPaymentCount > 0 && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  {newPaymentCount} New Payment Request{newPaymentCount !== 1 ? 's' : ''}!
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You have {newPaymentCount} new payment request{newPaymentCount !== 1 ? 's' : ''} from the last 24 hours. 
                  <button 
                    onClick={() => window.open('/admin/payments', '_blank')}
                    className="ml-2 underline hover:no-underline font-medium"
                  >
                    Review them now →
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : analyticsData ? (
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="analytics">Website Analytics</TabsTrigger>
              <TabsTrigger value="conversion">Sales Conversion</TabsTrigger>
              <TabsTrigger value="clients">Client Inquiries</TabsTrigger>
              <TabsTrigger value="customers">Customer Portal</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="website-updates">Website Updates</TabsTrigger>
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
                        const setupFee = payment.package === 'premium' ? 150 : 50;
                        const googleBusinessFee = payment.googleBusinessSetup ? 25 : 0;
                        return total + setupFee + googleBusinessFee;
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
                                  {client.clientCode && (
                                    <div className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                      {client.clientCode}
                                    </div>
                                  )}
                                  {client.selectedPackage && (
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      client.selectedPackage === 'premium' 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {client.selectedPackage.toUpperCase()}
                                    </div>
                                  )}
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    client.setupFeesPaid 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-orange-100 text-orange-800'
                                  }`}>
                                    {client.setupFeesPaid ? '✓ Paid' : '⏳ Payment Pending'}
                                  </div>
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
                                    {client.templateStyle && (
                                      <p><span className="font-medium">Template Style:</span> <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">{client.templateStyle}</span></p>
                                    )}
                                    {client.colorScheme && (
                                      <p><span className="font-medium">Color Scheme:</span> <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">{client.colorScheme}</span></p>
                                    )}
                                    {client.layoutPreference && (
                                      <p><span className="font-medium">Layout:</span> <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-medium">{client.layoutPreference}</span></p>
                                    )}
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

            {/* Customer Portal Tab */}
            <TabsContent value="customers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Management
                  </CardTitle>
                  <CardDescription>Active customers with portal access and project management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Customer stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900">Total Clients</h4>
                        <p className="text-2xl font-bold text-blue-600">{clientData?.length || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900">Paid Setup Fees</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {clientData?.filter((c: any) => c.setupFeesPaid).length || 0}
                        </p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-amber-900">Pending Payment</h4>
                        <p className="text-2xl font-bold text-amber-600">
                          {clientData?.filter((c: any) => !c.setupFeesPaid).length || 0}
                        </p>
                      </div>
                    </div>

                    {clientData && clientData.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">All Clients</h4>
                        {clientData.map((client: any) => (
                          <div key={client.id} className="border rounded-lg p-4 bg-slate-50">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-semibold text-slate-900">{client.fullName}</h5>
                                  {client.clientCode && (
                                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                                      {client.clientCode}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600">{client.email}</p>
                                {client.businessName && (
                                  <p className="text-sm text-slate-500">{client.businessName}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  client.setupFeesPaid 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {client.setupFeesPaid ? 'Paid' : 'Pending Payment'}
                                </span>
                                <p className="text-sm text-slate-500 mt-1">
                                  {client.selectedPackage === 'basic' ? 'Basic (£75)' : 'Premium (£150)'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const jsonData = {
                                    clientCode: client.clientCode,
                                    businessName: client.businessName,
                                    fullName: client.fullName,
                                    email: client.email,
                                    phone: client.phone,
                                    package: client.selectedPackage,
                                    templateStyle: client.templateStyle,
                                    templateVariation: client.templateVariation,
                                    colorScheme: client.colorScheme,
                                    businessDescription: client.businessDescription,
                                    pagesNeeded: client.pagesNeeded,
                                    textContent: client.textContent,
                                    hasImages: client.hasImages,
                                    hasLogo: client.hasLogo,
                                    layoutPreference: client.layoutPreference,
                                    exampleWebsites: client.exampleWebsites,
                                    wantsContactForm: client.wantsContactForm,
                                    googleBusinessSetup: client.googleBusinessSetup,
                                    socialMediaLinks: client.socialMediaLinks,
                                    specialRequests: client.specialRequests,
                                    hasDomain: client.hasDomain,
                                    existingDomain: client.existingDomain,
                                    desiredDomains: client.desiredDomains,
                                    setupFeesPaid: client.setupFeesPaid,
                                    status: client.status,
                                    createdAt: client.createdAt
                                  };
                                  
                                  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${client.clientCode}-project-details.json`;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(url);
                                  
                                  toast({
                                    title: "JSON Exported",
                                    description: `Downloaded ${client.clientCode}-project-details.json`,
                                  });
                                }}
                                data-testid={`button-export-json-${client.id}`}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Export JSON
                              </Button>
                              
                              <PostUpdateDialog 
                                clientCode={client.clientCode}
                                clientName={client.fullName}
                                clientEmail={client.email}
                                sessionPassword={sessionPassword}
                                toast={toast}
                                queryClient={queryClient}
                              />
                              
                              {!client.setupFeesPaid && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`/api/admin/create-customer-project?password=${encodeURIComponent(sessionPassword)}`, {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          clientOnboardingId: client.id
                                        }),
                                      });
                                      
                                      const result = await response.json();
                                      
                                      if (result.success) {
                                        queryClient.invalidateQueries({ queryKey: ['/api/admin/client-onboarding'] });
                                        toast({
                                          title: "Project Created",
                                          description: `Customer and project records created for ${client.clientCode}`,
                                        });
                                      } else {
                                        throw new Error(result.message || 'Failed to create project');
                                      }
                                    } catch (error: any) {
                                      toast({
                                        title: "Creation Failed",
                                        description: error.message,
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                  data-testid={`button-create-project-${client.id}`}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Create Project
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No client onboarding submissions yet.</p>
                        <p className="text-sm">Client submissions will appear here as they complete the onboarding form.</p>
                      </div>
                    )}
                  </div>
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

            {/* Website Updates Tab */}
            <TabsContent value="website-updates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Website Update Requests
                  </CardTitle>
                  <CardDescription>
                    Review requests from clients wanting to update their existing websites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {websiteUpdatesData?.data && websiteUpdatesData.data.length > 0 ? (
                      <div className="space-y-4">
                        {websiteUpdatesData.data.map((update: any) => {
                          const statusColors: Record<string, string> = {
                            pending: 'bg-yellow-100 text-yellow-800',
                            assessed: 'bg-blue-100 text-blue-800', 
                            quoted: 'bg-purple-100 text-purple-800',
                            'in-progress': 'bg-orange-100 text-orange-800',
                            completed: 'bg-green-100 text-green-800',
                            cancelled: 'bg-red-100 text-red-800'
                          };
                          const statusColor = statusColors[update.status] || 'bg-gray-100 text-gray-800';

                          const categoryPricingMap: Record<string, string> = {
                            basic: '£40-£75',
                            medium: '£100-£250', 
                            major: '£500+',
                            unsure: 'TBD'
                          };
                          const categoryPricing = categoryPricingMap[update.updateCategory] || 'Quote Required';

                          return (
                            <div key={update.id} className="border border-slate-200 rounded-lg p-6 bg-white">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-semibold text-slate-900">{update.name}</h3>
                                  <p className="text-slate-600">{update.email}</p>
                                  {update.businessName && (
                                    <p className="text-sm text-slate-500">{update.businessName}</p>
                                  )}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                  {update.status.charAt(0).toUpperCase() + update.status.slice(1).replace('-', ' ')}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <span className="font-medium text-slate-900">Current Website:</span>
                                  <a href={update.currentWebsite} target="_blank" rel="noopener noreferrer" 
                                     className="text-blue-600 hover:underline ml-2 inline-flex items-center">
                                    {update.currentWebsite}
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </div>
                                <div>
                                  <span className="font-medium text-slate-900">Update Category:</span>
                                  <span className="ml-2 text-slate-700">
                                    {update.updateCategory.charAt(0).toUpperCase() + update.updateCategory.slice(1)} 
                                    ({categoryPricing})
                                  </span>
                                </div>
                                {update.timeline && (
                                  <div>
                                    <span className="font-medium text-slate-900">Timeline:</span>
                                    <span className="ml-2 text-slate-700">{update.timeline}</span>
                                  </div>
                                )}
                                {update.budget && (
                                  <div>
                                    <span className="font-medium text-slate-900">Budget:</span>
                                    <span className="ml-2 text-slate-700">{update.budget}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mb-4">
                                <span className="font-medium text-slate-900">Description:</span>
                                <p className="text-slate-700 mt-1">{update.description}</p>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">
                                  Submitted: {new Date(update.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex space-x-2">
                                  <Select 
                                    value={update.status} 
                                    onValueChange={(newStatus) => {
                                      updateWebsiteUpdateStatus.mutate({ id: update.id, status: newStatus });
                                    }}
                                  >
                                    <SelectTrigger className="w-40">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="assessed">Assessed</SelectItem>
                                      <SelectItem value="quoted">Quoted</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Settings className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 mb-2">No website update requests yet</p>
                        <p className="text-sm text-slate-500">
                          When clients request website updates, they will appear here for review and quoting.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : null}
      </div>
    </div>
  );
}