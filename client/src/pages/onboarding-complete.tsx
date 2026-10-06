import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function OnboardingCompletePage() {
  let name = "";
  try {
    const data = JSON.parse(sessionStorage.getItem("onboardingComplete") || "{}");
    name = (data.name || "").split(" ")[0];
  } catch {
    // ignore - just show the generic thank-you
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardContent className="pt-10 pb-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>

          <h1 className="text-4xl font-bold text-emerald-600 mb-3">
            {name ? `Thank you, ${name}!` : "Thank you!"}
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            We've received your project details. We'll be in touch within 24 hours
            to talk through your website and the next steps, including setting up payment.
          </p>

          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            data-testid="button-back-home"
          >
            Back to Home
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
