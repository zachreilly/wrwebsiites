import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Copy, Check, Lock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingCompletePage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Read from sessionStorage (secure - not in URL history)
  const dataStr = sessionStorage.getItem('onboardingComplete');
  console.log('OnboardingCompletePage - sessionStorage data:', dataStr);
  
  const data = dataStr ? JSON.parse(dataStr) : {};
  
  const clientCode = data.clientCode || '';
  const password = data.password || '';
  const email = data.email || '';
  const name = data.name || '';
  const businessName = data.businessName || '';
  const packageType = data.package || '';
  const clientId = data.clientId || '';

  // Clear sensitive data from sessionStorage after component mounts
  useEffect(() => {
    // Give a moment for the page to render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    // Keep data for this page load, but clear after navigation
    return () => {
      clearTimeout(timer);
      sessionStorage.removeItem('onboardingComplete');
    };
  }, []);

  // Redirect to home if no data (direct access without going through onboarding)
  if (!isLoading && (!clientCode || !password)) {
    console.warn('No onboarding data found, redirecting to onboarding page');
    window.location.href = '/onboarding';
    return null;
  }
  
  // Show loading state while checking data
  if (isLoading || !clientCode || !password) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your details...</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string, type: 'code' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `${type === 'code' ? 'Client code' : 'Password'} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the text",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSetup = () => {
    const params = new URLSearchParams({
      email,
      name,
      businessName,
      package: packageType,
      clientId
    });
    window.location.href = `/payment-setup?${params.toString()}`;
  };

  const handlePortalAccess = () => {
    window.location.href = `/customer/login`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardContent className="pt-10 pb-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>

          {/* Header */}
          <h1 className="text-4xl font-bold text-emerald-600 text-center mb-3">
            Welcome Aboard, {name.split(' ')[0]}!
          </h1>
          <p className="text-lg text-slate-600 text-center mb-8">
            Your website project has been created successfully
          </p>

          {/* Important Notice */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-amber-900 text-lg mb-2 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Save These Details Now!
            </h3>
            <p className="text-amber-800 mb-4">
              You'll need these credentials to access your customer portal and track your website progress.
            </p>

            {/* Client Code */}
            <div className="mb-4">
              <label className="text-sm font-medium text-amber-900 block mb-2">
                Your Client Reference Code
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white border-2 border-amber-400 rounded-lg px-4 py-3 font-mono text-2xl font-bold text-amber-900 text-center">
                  {clientCode}
                </div>
                <Button
                  onClick={() => copyToClipboard(clientCode, 'code')}
                  variant="outline"
                  className="border-amber-400 hover:bg-amber-100"
                  data-testid="button-copy-code"
                >
                  {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Portal Password */}
            <div>
              <label className="text-sm font-medium text-amber-900 block mb-2">
                Your Customer Portal Password
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white border-2 border-amber-400 rounded-lg px-4 py-3 font-mono text-2xl font-bold text-amber-900 text-center tracking-wider">
                  {password}
                </div>
                <Button
                  onClick={() => copyToClipboard(password, 'password')}
                  variant="outline"
                  className="border-amber-400 hover:bg-amber-100"
                  data-testid="button-copy-password"
                >
                  {copiedPassword ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <p className="text-sm text-amber-700 mt-4 italic">
              💡 Take a screenshot or write these down! You'll use your email ({email}) and this password to login.
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4 text-lg">What Happens Next?</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>We'll start designing your website based on your preferences</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Track progress anytime through your customer portal</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>You can set up payment now or later - completely flexible!</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Your website setup fee is only charged when your site goes live</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handlePaymentSetup}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold"
              data-testid="button-setup-payment"
            >
              <Lock className="w-5 h-5 mr-2" />
              Set Up Payment Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button 
              onClick={handlePortalAccess}
              variant="outline"
              className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-6 text-lg font-semibold"
              data-testid="button-access-portal"
            >
              <User className="w-5 h-5 mr-2" />
              Access Customer Portal (Pay Later)
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-center text-sm text-slate-500 mt-4">
              No rush! You can access the customer portal anytime and set up payment whenever you're ready.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
