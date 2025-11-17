import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  LogOut,
  Plus,
  Eye,
  Bell
} from "lucide-react";
import type { Customer, Project, Transaction, Invoice, DesignApproval, ChangeRequest } from "@shared/schema";
import { BillingSection } from "@/components/BillingSection";

interface CustomerData {
  customer: Customer & {
    setupFeesPaid?: boolean;
    clientCode?: string;
  };
  projects: Project[];
  transactions: Transaction[];
  invoices: Invoice[];
}

export default function CustomerDashboard() {
  const [, params] = useRoute("/customer/dashboard/:customerId?");
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [designs, setDesigns] = useState<DesignApproval[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [projectUpdates, setProjectUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Get customer data from localStorage or URL params
  const getCustomerId = () => {
    if (params?.customerId) return params.customerId;
    
    const stored = localStorage.getItem("customerData");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.id;
    }
    return null;
  };

  useEffect(() => {
    const customerId = getCustomerId();
    if (!customerId) {
      window.location.href = "/customer/login";
      return;
    }

    loadCustomerData(customerId);
    loadProjectUpdates(customerId);
  }, []);

  useEffect(() => {
    if (activeProject) {
      loadProjectData(activeProject.id);
    }
  }, [activeProject]);

  const loadCustomerData = async (customerId: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", `/api/customer/${customerId}/dashboard`);
      const data = await response.json();
      
      if (data.success) {
        setCustomerData(data.data);
        if (data.data.projects.length > 0) {
          setActiveProject(data.data.projects[0]);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load customer data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectData = async (projectId: string) => {
    try {
      const [designsResponse, requestsResponse] = await Promise.all([
        apiRequest("GET", `/api/customer/project/${projectId}/designs`),
        apiRequest("GET", `/api/customer/project/${projectId}/change-requests`)
      ]);

      const designsData = await designsResponse.json();
      const requestsData = await requestsResponse.json();

      if (designsData.success) setDesigns(designsData.data);
      if (requestsData.success) setChangeRequests(requestsData.data);
    } catch (error) {
      console.error("Failed to load project data:", error);
    }
  };

  const loadProjectUpdates = async (customerId: string) => {
    try {
      const response = await apiRequest("GET", `/api/customer/${customerId}/updates`);
      const data = await response.json();
      
      if (data.success) {
        setProjectUpdates(data.data);
        
        // Mark as read and update local state
        try {
          await apiRequest("PATCH", `/api/customer/${customerId}/updates/mark-read`);
          // Update local state to mark all as read
          setProjectUpdates(prev => prev.map(update => ({ ...update, isRead: true })));
        } catch (error) {
          console.error("Failed to mark updates as read:", error);
          // Don't show error to user since updates still loaded successfully
        }
      }
    } catch (error) {
      console.error("Failed to load project updates:", error);
      toast({
        title: "Error",
        description: "Failed to load project updates",
        variant: "destructive",
      });
    }
  };

  const handleDesignApproval = async (designId: string, status: string, feedback?: string) => {
    try {
      const response = await apiRequest("PATCH", `/api/customer/design/${designId}`, {
        status,
        feedback
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Design Updated",
          description: `Design ${status} successfully`,
        });
        
        // Reload designs
        if (activeProject) {
          loadProjectData(activeProject.id);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update design",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customerData");
    window.location.href = "/customer/login";
  };

  const formatCurrency = (amountInPence: number | null) => {
    if (amountInPence === null) return '£0.00';
    return `£${(amountInPence / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'completed':
      case 'paid':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to access your dashboard</p>
            <Button onClick={() => window.location.href = "/customer/login"}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-welcome">
                Welcome, {customerData.customer.firstName}!
              </h1>
              <p className="text-gray-600">
                {customerData.customer.businessName} • {customerData.customer.package} Package
              </p>
              {customerData.customer.clientCode && (
                <p className="text-sm text-gray-500 mt-1">Client Code: {customerData.customer.clientCode}</p>
              )}
              {customerData.customer.desiredCompletionDate && (
                <p className="text-sm text-amber-600 font-medium mt-1" data-testid="text-customer-completion-date">
                  Target Completion: {new Date(customerData.customer.desiredCompletionDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}
              {customerData.customer.package === 'premium' && (
                customerData.customer.wantsUserAuth || customerData.customer.wantsDatabase || 
                customerData.customer.wantsPaymentProcessing || customerData.customer.wantsCrudOperations || 
                customerData.customer.wantsAdminPanel || customerData.customer.wantsProductionFeatures
              ) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {customerData.customer.wantsUserAuth && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                      🔐 User Auth
                    </span>
                  )}
                  {customerData.customer.wantsDatabase && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                      💾 Database
                    </span>
                  )}
                  {customerData.customer.wantsPaymentProcessing && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                      💳 Payments
                    </span>
                  )}
                  {customerData.customer.wantsCrudOperations && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                      ⚙️ CRUD
                    </span>
                  )}
                  {customerData.customer.wantsAdminPanel && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                      📊 Admin Panel
                    </span>
                  )}
                  {customerData.customer.wantsProductionFeatures && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                      🚀 Production
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Show "Set Up Payment" button if not paid */}
              {customerData.customer.setupFeesPaid === false && (
                <Button 
                  onClick={() => {
                    const fullName = `${customerData.customer.firstName} ${customerData.customer.lastName}`.trim();
                    const params = new URLSearchParams({
                      clientId: customerData.customer.id || '',
                      email: customerData.customer.email || '',
                      name: fullName,
                      businessName: customerData.customer.businessName || '',
                      package: customerData.customer.package || ''
                    });
                    window.location.href = `/payment-setup?${params.toString()}`;
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-setup-payment"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Set Up Payment Now
                </Button>
              )}
              <Badge className={getStatusColor(customerData.customer.subscriptionStatus)}>
                {customerData.customer.subscriptionStatus || 'inactive'}
              </Badge>
              <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Mode Banner */}
        {customerData.customer.demoMode && !customerData.customer.demoApproved && (
          <Card className="mb-6 border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">This is Your FREE Demo Website!</h3>
                      <p className="text-sm text-blue-700">No payment required yet</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We'll build your demo website based on the preferences you provided. Once we complete it and you approve it, you can start payment to make it live!
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">What happens next:</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2">1.</span>
                        <span>We'll build your demo website (usually within 3-5 days)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2">2.</span>
                        <span>You'll review it in this portal and provide feedback</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2">3.</span>
                        <span>Once you approve it, click the button below to set up payment and make it live!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Demo Approval Banner - Shows when demo is ready */}
        {customerData.customer.demoMode && !customerData.customer.setupFeesPaid && activeProject?.status === 'review' && (
          <Card className="mb-6 border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                    <div>
                      <h3 className="text-xl font-bold text-green-900">Your Demo is Ready for Review!</h3>
                      <p className="text-sm text-green-700">Love it? Let's make it live!</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Your free demo website is complete! Review it below and if you're happy with it, click the button to approve and set up payment.
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    const fullName = `${customerData.customer.firstName} ${customerData.customer.lastName}`.trim();
                    const params = new URLSearchParams({
                      clientId: customerData.customer.id || '',
                      email: customerData.customer.email || '',
                      name: fullName,
                      businessName: customerData.customer.businessName || '',
                      package: customerData.customer.package || '',
                      fromDemo: 'true'
                    });
                    window.location.href = `/payment-setup?${params.toString()}`;
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-6 text-lg h-auto whitespace-nowrap"
                  data-testid="button-approve-demo"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve & Start Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="projects" data-testid="tab-projects">
              <FileText className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="designs" data-testid="tab-designs">
              <Eye className="w-4 h-4 mr-2" />
              Design Reviews
            </TabsTrigger>
            <TabsTrigger value="billing" data-testid="tab-billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="referrals" data-testid="tab-referrals">
              <User className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="updates" data-testid="tab-updates">
              <Bell className="w-4 h-4 mr-2" />
              Updates
            </TabsTrigger>
            <TabsTrigger value="support" data-testid="tab-support">
              <MessageSquare className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Projects</h2>
              <Badge variant="outline" data-testid="text-project-count">
                {customerData.projects.length} Active Projects
              </Badge>
            </div>

            {customerData.projects.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                  <p className="text-gray-600">Your projects will appear here once we start working on them.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {customerData.projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle data-testid={`text-project-name-${project.id}`}>
                            {project.projectName}
                          </CardTitle>
                          <CardDescription>{project.projectDescription}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Project Details</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {project.domainName && (
                              <p>Domain: {project.domainName}</p>
                            )}
                            <p>Priority: {project.priority}</p>
                            {project.estimatedCompletionDate && (
                              <p>Est. Completion: {new Date(project.estimatedCompletionDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <Button
                            onClick={() => setActiveProject(project)}
                            variant="outline"
                            className="w-full"
                            data-testid={`button-view-project-${project.id}`}
                          >
                            View Project Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="designs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Design Reviews</h2>
              {activeProject && (
                <Badge variant="outline">
                  Project: {activeProject.projectName}
                </Badge>
              )}
            </div>

            {designs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Designs Yet</h3>
                  <p className="text-gray-600">
                    Design mockups and assets will appear here for your review and approval.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {designs.map((design) => (
                  <Card key={design.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle data-testid={`text-design-title-${design.id}`}>
                            {design.designTitle}
                          </CardTitle>
                          <CardDescription>{design.designDescription}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(design.status)}>
                          {design.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {design.designImageUrl && (
                        <div className="mb-4">
                          <img 
                            src={design.designImageUrl} 
                            alt={design.designTitle}
                            className="w-full max-w-md rounded-lg border"
                          />
                        </div>
                      )}
                      
                      {design.status === 'pending' && (
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => handleDesignApproval(design.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                            data-testid={`button-approve-${design.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleDesignApproval(design.id, 'revision_requested', 'Please make revisions')}
                            variant="outline"
                            data-testid={`button-request-changes-${design.id}`}
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Request Changes
                          </Button>
                          <Button
                            onClick={() => handleDesignApproval(design.id, 'rejected')}
                            variant="destructive"
                            data-testid={`button-reject-${design.id}`}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {design.customerFeedback && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-semibold mb-1">Your Feedback:</h5>
                          <p className="text-sm text-gray-700">{design.customerFeedback}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <Badge>{customerData.customer.package}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(customerData.customer.subscriptionStatus)}>
                      {customerData.customer.subscriptionStatus || 'inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Fee:</span>
                    <span className="font-semibold">
                      {formatCurrency(customerData.customer.monthlyFee)}
                    </span>
                  </div>
                  {customerData.customer.nextBillingDate && (
                    <div className="flex justify-between">
                      <span>Next Billing:</span>
                      <span>{new Date(customerData.customer.nextBillingDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <BillingSection customerId={customerData.customer.id} />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-900">
                  <User className="w-5 h-5 mr-2" />
                  Referral Program
                </CardTitle>
                <CardDescription className="text-emerald-700">
                  Earn £10 for you and your friends when they sign up!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white rounded-lg p-6 border-2 border-emerald-300 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Your Referral Code</h3>
                      <p className="text-sm text-gray-600">Share this code with friends</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-100 px-6 py-3 rounded-lg">
                        <span className="text-2xl font-bold text-emerald-700" data-testid="text-referral-code">
                          {customerData.customer.referralCode || customerData.customer.clientCode || 'N/A'}
                        </span>
                      </div>
                      <Button
                        onClick={() => {
                          const code = customerData.customer.referralCode || customerData.customer.clientCode || '';
                          navigator.clipboard.writeText(code);
                          toast({
                            title: "Copied!",
                            description: "Referral code copied to clipboard",
                          });
                        }}
                        variant="outline"
                        size="sm"
                        data-testid="button-copy-referral"
                      >
                        Copy Code
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-around pt-4 border-t border-emerald-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600" data-testid="text-total-referrals">
                        {customerData.customer.totalReferrals || 0}
                      </div>
                      <div className="text-sm text-gray-600">Successful Referrals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">
                        £{((customerData.customer.totalReferrals || 0) * 10).toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Earned for Friends</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold mb-2 text-gray-900">How It Works</h4>
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li>1. Share your referral code with friends</li>
                      <li>2. They enter it during onboarding</li>
                      <li>3. They get £10 off their setup fee</li>
                      <li>4. Your referral count increases!</li>
                    </ol>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold mb-2 text-gray-900">Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Friends save £10 on setup</li>
                      <li>• Unlimited referrals allowed</li>
                      <li>• Instant discount at checkout</li>
                      <li>• Help friends build their business</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-emerald-100 rounded-lg p-4 border border-emerald-300">
                  <h4 className="font-semibold mb-2 text-emerald-900">Share Your Code</h4>
                  <p className="text-sm text-emerald-700 mb-3">
                    Use this message to tell your friends about wrwebsites:
                  </p>
                  <div className="bg-white rounded p-3 text-sm text-gray-700 border border-emerald-200">
                    <p className="italic">
                      "Hey! I just built my website with wrwebsites and they're amazing! 
                      Fast turnaround (about 3 days), affordable pricing, and great support. 
                      Use my referral code <strong>{customerData.customer.referralCode || customerData.customer.clientCode}</strong> 
                      to get £10 off your setup fee. Check them out at wrwebsites.com!"
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      const message = `Hey! I just built my website with wrwebsites and they're amazing! Fast turnaround (about 3 days), affordable pricing, and great support. Use my referral code ${customerData.customer.referralCode || customerData.customer.clientCode} to get £10 off your setup fee. Check them out!`;
                      navigator.clipboard.writeText(message);
                      toast({
                        title: "Copied!",
                        description: "Message copied to clipboard",
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    data-testid="button-copy-message"
                  >
                    Copy Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Project Updates
                </CardTitle>
                <CardDescription>
                  Stay informed about your project progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projectUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {projectUpdates.map((update, index) => (
                      <div 
                        key={update.id} 
                        className="flex gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        data-testid={`update-${index}`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">Admin Update</p>
                              <p className="text-sm text-gray-500">
                                {new Date(update.createdAt).toLocaleDateString('en-GB', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            {!update.isRead && (
                              <Badge className="bg-blue-600">New</Badge>
                            )}
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap mb-3" data-testid={`update-message-${index}`}>
                            {update.message}
                          </p>
                          {update.imageUrl && (
                            <div className="mt-3">
                              <img 
                                src={update.imageUrl} 
                                alt="Project update" 
                                className="rounded-lg border border-gray-300 max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(update.imageUrl!, '_blank')}
                                data-testid={`update-image-${index}`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-2">No updates yet</p>
                    <p className="text-sm text-gray-500">
                      We'll post updates here as we work on your project
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Need help with your project? Get in touch with our team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Email Support</h4>
                        <a 
                          href="mailto:zachhreillyy@gmail.com" 
                          className="text-primary hover:underline"
                          data-testid="link-email-support"
                        >
                          zachhreillyy@gmail.com
                        </a>
                      </div>
                      <div>
                        <h4 className="font-semibold">Phone Support</h4>
                        <div className="space-y-1">
                          <a href="tel:07397985279" className="block text-primary hover:underline">
                            07397985279
                          </a>
                          <a href="tel:07535778637" className="block text-primary hover:underline">
                            07535778637
                          </a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Response Times</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Email: Within 2 hours</li>
                        <li>• Phone: Immediate during business hours</li>
                        <li>• Emergency: Call for urgent issues</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Requests</CardTitle>
                  <CardDescription>
                    Request changes to your project or add new features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {changeRequests.length === 0 ? (
                    <div className="text-center py-6">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No change requests submitted yet</p>
                      <Button 
                        className="mt-4"
                        onClick={() => {
                          // Future: Add change request form
                          toast({
                            title: "Coming Soon",
                            description: "Change request form will be available soon. Please contact support for now.",
                          });
                        }}
                        data-testid="button-new-change-request"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Change Request
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {changeRequests.map((request) => (
                        <div key={request.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{request.title}</h4>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{request.description}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Type: {request.requestType}</span>
                            <span>Priority: {request.priority}</span>
                          </div>
                          {request.adminResponse && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <h5 className="font-semibold text-sm">Our Response:</h5>
                              <p className="text-sm text-gray-700">{request.adminResponse}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}