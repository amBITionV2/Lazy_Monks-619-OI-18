"use client"
import { useState } from 'react';
import { Signin } from '@/app/signin/AuthPage/Signin';
import { Signup } from '@/app/signin/AuthPage/Signup';

const AuthPage = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Glassmorphic Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">
        <h1 className="text-white text-3xl md:text-4xl font-bold font-['Poppins'] mb-6 text-center">
          {mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
        </h1>

        {mode === 'signin' ? <Signin /> : <Signup />}

        <div className="text-center text-white text-sm mt-4">
          {mode === 'signin' ? (
            <>
              Don’t have an account?{' '}
              <button
                className="text-cyan-300 hover:text-cyan-200 underline transition-colors"
                onClick={() => setMode('signup')}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                className="text-cyan-300 hover:text-cyan-200 underline transition-colors"
                onClick={() => setMode('signin')}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
