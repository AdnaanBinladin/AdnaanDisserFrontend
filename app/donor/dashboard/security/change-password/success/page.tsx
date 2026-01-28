"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function PasswordChangeSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="shadow-xl border-0 max-w-md w-full overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-secondary to-secondary/80 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-secondary-foreground/20 flex items-center justify-center mb-4 animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-secondary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-foreground">Password Updated!</h1>
          </div>
        </div>

        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            <p className="text-foreground font-medium text-lg">
              Your password has been updated successfully
            </p>
            <p className="text-muted-foreground">
              {"You'll be redirected to login for security reasons"}
            </p>

            {/* Redirect Indicator */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>Redirecting in <span className="font-bold text-foreground">{countdown}</span> seconds...</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-4">
              <a
                href="/"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Go to login now
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
