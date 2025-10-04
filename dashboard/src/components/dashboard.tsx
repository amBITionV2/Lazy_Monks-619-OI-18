"use client";
import React from 'react';
import { useAuth } from '../context/AuthContext'; 
import Header from '../components/Header';

const DashboardPage = () => {
  const { isAuthenticated } = useAuth();

  // This is a simple way to protect the route on the client-side.
  // In a real app, you would also have server-side protection.
  if (!isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="mt-2">Please <a href="/signin" className="text-indigo-600 underline">sign in</a> to view the dashboard.</p>
        </div>
    );
  }

  return (
    <div>
        {/* We add the Header here so it's present on the dashboard page */}
        <Header /> 
        <main className="pt-20"> {/* Add padding to offset the fixed header */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
                <p className="mt-4">This page is only visible to authenticated users.</p>
                {/* Your dashboard content goes here */}
            </div>
        </main>
    </div>
  );
};

export default DashboardPage;