import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function WaitlistSection() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
  // Mutation for waitlist signup
  const waitlistMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/waitlist", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. Thanks for your interest!",
      });
      setEmail("");
    },
    onError: (error: any) => {
      let message = "Failed to join waitlist. Please try again.";
      
      // Try to get more specific error message if available
      if (error?.message) {
        message = error.message;
      }
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    waitlistMutation.mutate(email);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to streamline your trademark search?</span>
            <span className="block text-blue-200">Join our waitlist for early access.</span>
          </h2>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <form className="sm:flex" onSubmit={handleSubmit}>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={waitlistMutation.isPending}
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                  disabled={waitlistMutation.isPending}
                >
                  {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-blue-200">
              By joining, you agree to receive updates about our product. Privacy policy available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
