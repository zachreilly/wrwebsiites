import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/customer/login", { email, password });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.message || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.customer) {
        // Store customer data in localStorage for simple auth
        localStorage.setItem("customerData", JSON.stringify(data.customer));
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.customer.firstName}!`,
        });

        // Redirect to customer dashboard
        setTimeout(() => {
          window.location.href = "/customer/dashboard";
        }, 500);
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid response from server",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: error.message || "Failed to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => window.location.href = "/"}
            className="text-white hover:bg-white/10 mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Customer Portal</h1>
          <p className="text-green-100">Access your project dashboard and track progress</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Customer Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email address to access your customer dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Portal Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your portal password"
                    className="pl-10 pr-10"
                    required
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This was provided when you completed the onboarding form
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "Logging in..." : "Access My Dashboard"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">New Customer?</h4>
              <p className="text-sm text-blue-800 mb-3">
                Complete the onboarding form to receive your portal password and start your website project.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/onboarding"}
                className="w-full"
                data-testid="button-get-started"
              >
                Get Started - Create Your Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}