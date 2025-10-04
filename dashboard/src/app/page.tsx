"use client"
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Demo from '../components/Demo';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Demo/>
      <Footer />
    </div>
  );
}

export default App;