import React from 'react';
import { ArrowRight, Zap, Shield, Brain, LifeBuoy, Globe2, Database, Waves } from 'lucide-react';

const Hero = () => {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                <Waves className="w-4 h-4 mr-2" />
                Resilient Coastal Intelligence
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Samudra
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {' '}Prahari{' '}
                </span>
                A Coastal Resilience Platform
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Fusing citizen-powered reports, autonomous scrapers, and INCOIS analyst oversight to 
                deliver real-time, verified coastal hazard intelligence — online and offline.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To safeguard India’s coasts by combining local voices, AI analysis, and institutional
                validation into a trustworthy disaster response and awareness platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToDemo}
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
              >
                View Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Visual Workflow */}
          <div className="relative">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-white text-xl font-semibold mb-8">Platform Workflow</h3>
              
              <div className="space-y-6">
                {[
                  { icon: Brain, title: 'Citizen App', desc: 'Offline-first app for hazard reports, tides & SOS' },
                  { icon: Database, title: 'Backend & Scrapers', desc: 'AI-powered services that ingest, analyze & verify data' },
                  { icon: Shield, title: 'Analyst Dashboard', desc: 'INCOIS validates events & coordinates responses' }
                ].map((agent, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <agent.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{agent.title}</h4>
                      <p className="text-white/80 text-sm">{agent.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connecting Lines */}
              <div className="absolute left-1/2 transform -translate-x-1/2 space-y-4 mt-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="w-0.5 h-6 bg-white/30 mx-auto"></div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-4 shadow-lg animate-bounce">
              <Globe2 className="w-6 h-6 text-yellow-900" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-400 rounded-full p-4 shadow-lg animate-pulse">
              <LifeBuoy className="w-6 h-6 text-green-900" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;