"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';

export const Signup: React.FC = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!name) {
      setMessage("Please enter your name.");
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            // By default, new users might be 'USER', not 'OFFICIAL'
            // You would typically change their role in your Supabase dashboard
            // or through a secure backend function.
            user_role: 'USER' 
          },
        },
      });

      if (error) throw error;
      
      // Redirect to profile page on successful signup
      // Supabase sends a confirmation email by default.
      setMessage("Check your email for a confirmation link!");
      // You might want to wait a bit before redirecting, or show a success page.
      setTimeout(() => {
        router.push("/u/dashboard");
        router.refresh();
      }, 3000);

    } catch (error: any) {
      // Provide more user-friendly error messages
      let errorMessage = "Failed to sign up. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
      } else if (error.message.includes('Password should be at least 6 characters')) {
        errorMessage = 'The password is too weak. Please choose a stronger password (min. 6 characters).';
      }
      setMessage(errorMessage || error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
       <div>
        <label className="text-white text-sm font-medium" htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          required
          className="w-full p-3 mt-1 rounded-md bg-gradient-to-tr from-orange-100 via-pink-100 to-yellow-100 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 "
        />
      </div>

      <div>
        <label className="text-white text-sm font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="yourname@example.com"
          required
          className="w-full p-3 mt-1 rounded-md bg-gradient-to-tr from-orange-100 via-pink-100 to-yellow-100 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <div>
        <label className="text-white text-sm font-medium" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          required
          className="w-full p-3 mt-1 rounded-md bg-gradient-to-tr from-orange-100 via-pink-100 to-yellow-100 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold hover:from-purple-700 hover:to-blue-600 transition-all duration-200"
      >
        Sign Up
      </button>

      {message && <p className="text-center pt-2 text-sm text-green-300">{message}</p>}
    </form>
  );
};
