"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';

const IssueAlertButton = () => {
  const { user, session } = useAuth();

  // Client-side check for the role from the custom claim.
  // This hides the button from non-official users even if they somehow see the page.
  if (user?.app_metadata?.user_role !== 'OFFICIAL') {
    return null; // Don't render the button at all
  }

  const handleIssueAlert = async () => {
    console.log("Issuing a new alert...");

    // This is where you would make the secure API call to your FastAPI backend.
    if (!session) {
        console.error("User is not authenticated.");
        // You could show a notification to the user here.
        return;
    }

    const alertData = {
        title: "New High Wave Warning",
        level: "CRITICAL",
        area: "Mumbai Coast",
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/alerts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // The crucial part: send the JWT to the backend
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(alertData)
      });
  
      if (!response.ok) {
        throw new Error("Failed to create alert on the backend.");
      }
  
      const result = await response.json();
      console.log("Alert created successfully:", result);
      // Show a success toast/notification to the user
      
    } catch (error) {
      console.error("API Call failed:", error);
      // For demonstration, we log the error. In a real app, you'd handle this gracefully.
      // e.g., show an error message to the user.
      alert("Could not issue alert. Check console for details. (This is a demo API call).");
    }
  };

  return (
    <Button 
        onClick={handleIssueAlert}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
    >
        <Megaphone className="mr-2 h-4 w-4" />
        Issue New Alert
    </Button>
    );
};

export default IssueAlertButton;
