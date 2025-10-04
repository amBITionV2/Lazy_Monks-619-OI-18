import React from 'react';
import { Waves, LifeBuoy, Radio, Database, Shield, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const agents = [
    {
      name: 'Citizen App (React Native)',
      icon: Waves,
      color: 'from-blue-500 to-cyan-600',
      description: 'The primary tool for citizens to report hazards, use daily coastal data, and activate SOS in emergencies.',
      responsibilities: [
        'Hazard reporting with GPS and media',
        'Daily tide/weather “Coastal Companion”',
        'Offline caching & background sync',
        'P2P mesh network relay during crises'
      ]
    },
    {
      name: 'Backend & Scraper Services',
      icon: Database,
      color: 'from-green-500 to-emerald-600',
      description: 'FastAPI backend with intelligent scraper services that ingest, analyze, and refine coastal hazard data.',
      responsibilities: [
        'Citizen & relayed report ingestion',
        'Autonomous social media scraping',
        'AI-powered NLP & image verification',
        'Keyword tuning & discovery loops'
      ]
    },
    {
      name: 'Analyst Dashboard (Next.js)',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      description: 'Mission control for analysts to monitor coastal events in real-time, validate posts, and reinforce the system.',
      responsibilities: [
        'Real-time hazard map & SOS alerts',
        'Feedback on social media posts',
        'Keyword approval & tuning oversight',
        'Crisis coordination & safety guidance'
      ]
    }
  ];

  const workflow = [
    { step: 1, title: 'Report or Detect', desc: 'Citizen reports hazards OR scraper finds coastal posts' },
    { step: 2, title: 'Ingest & Store', desc: 'Data securely stored in Supabase with media and metadata' },
    { step: 3, title: 'AI Analysis', desc: 'NLP & image models verify hazard type, location, and severity' },
    { step: 4, title: 'Analyst Feedback', desc: 'Dashboard analysts validate, correct, and reinforce the loop' },
    { step: 5, title: 'Action & Alerts', desc: 'Verified info and SOS alerts are pushed to responders' }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How Samudra Prahari Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Samudra Prahari is a resilient dual-mode platform combining citizen-powered reporting, 
            intelligent scrapers, and real-time dashboards to protect coastal communities — both online and offline.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {agents.map((agent, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${agent.color} p-6 text-white`}>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <agent.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">{agent.name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6">{agent.description}</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Key Responsibilities:</h4>
                <ul className="space-y-2">
                  {agent.responsibilities.map((responsibility, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <LifeBuoy className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Process */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">End-to-End Workflow</h3>
          
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-4">
            {workflow.map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center space-y-3 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 max-w-xs">{item.desc}</p>
                </div>
                
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
