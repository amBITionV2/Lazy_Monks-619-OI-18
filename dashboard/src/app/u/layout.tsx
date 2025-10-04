import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { AlertTriangle, LogOut } from 'lucide-react';

// This layout will apply server-side protection to all routes under /u/
const ULayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 1. If no user is logged in, redirect to the sign-in page.
  if (!user) {
    return redirect('/signin');
  }

  // 2. If the user is logged in but does not have the 'OFFICIAL' role, show an access denied message.
  // This prevents the dashboard from ever rendering for unauthorized users.
  if (user.app_metadata?.user_role !== 'OFFICIAL') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg border border-red-200 max-w-md">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have the required permissions to view this page. This area is restricted to OFFICIAL users only.
          </p>
          <div className="flex flex-col space-y-3">
             <a
              href="/"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow"
            >
              Return to Homepage
            </a>
            <form action="/auth/signout" method="post" className="w-full">
               <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
               >
                 <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. If the user is an authenticated OFFICIAL, render the dashboard content.
  return <>{children}</>;
};

export default ULayout;

