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
  Eye
} from "lucide-react";
import type { Customer, Project, Transaction, Invoice, DesignApproval, ChangeRequest } from "@shared/schema";

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
          <div className="flex justify-between items-center">
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
            </div>
            <div className="flex items-center space-x-4">
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
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
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
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerData.transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.billingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                        <Badge className={`${getStatusColor(transaction.status)} text-xs`}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {customerData.transactions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No transactions yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{new Date(transaction.billingDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{transaction.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(transaction.amount)}</p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
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