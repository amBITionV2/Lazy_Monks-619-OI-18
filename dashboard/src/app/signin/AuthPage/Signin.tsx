"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';

export const Signin: React.FC = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      router.push("/u/dashboard");
      router.refresh(); // Important to re-evaluate the layout's server-side logic
    } catch (error: any) {
      setMessage(error.message || "Failed to sign in.");
    }
  };

  return (
    <form onSubmit={handleSignin}>
      <label className="text-white text-sm">Email</label>
      <input
        name="email"
        type="email"
        placeholder="Yourname@gmail.com"
        className="w-full p-3 rounded-md text-black placeholder:text-gray-400 mb-4 bg-gradient-to-tr from-orange-100 via-pink-100 to-yellow-100"
      />

      <label className="text-white text-sm">Password</label>
      <input
        name="password"
        type="password"
        placeholder="********"
        className="w-full p-3 rounded-md text-black placeholder:text-gray-400 mb-4 bg-gradient-to-tr from-orange-100 via-pink-100 to-yellow-100"
      />

      <button
        type="submit"
        className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold mb-6 hover:from-purple-700 hover:to-blue-600 transition-all duration-200"
      >
        Sign In
      </button>
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </form>
  );
};
