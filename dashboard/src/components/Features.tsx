import React from 'react';
import { Smartphone, Database, Satellite, Shield, Zap, Eye } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Citizen-First Reporting',
      description: 'Empowers coastal citizens with an offline-ready app to share real-time hazard updates.',
      benefits: ['Offline mode support', 'Photo & video evidence', 'SOS feature for emergencies'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Database,
      title: 'Autonomous Data Collection',
      description: 'Scrapers and APIs gather information from social media and official feeds.',
      benefits: ['Social media monitoring', 'Satellite/ocean data ingestion', 'Automated cataloging'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Satellite,
      title: 'Integrated Coastal Intelligence',
      description: 'Combines citizen inputs with scientific datasets for holistic hazard awareness.',
      benefits: ['INCOIS data fusion', 'Geotagged hazard maps', 'Context-aware insights'],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Shield,
      title: 'Verified & Secure',
      description: 'Multi-layer verification ensures authenticity before alerts reach agencies.',
      benefits: ['Cross-checking reports', 'AI-based anomaly detection', 'Tamper-proof records'],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Rapid Alerts',
      description: 'Delivers coastal alerts instantly to agencies and communities at risk.',
      benefits: ['Sub-minute response', 'Automated push notifications', 'Real-time dashboards'],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Eye,
      title: 'Transparent Operations',
      description: 'Every report and analysis step is traceable for public trust and accountability.',
      benefits: ['Clear verification trail', 'Open methodology', 'Community visibility'],
      color: 'from-teal-500 to-green-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Samudra Prahari combines citizen participation, AI-driven verification, and 
            institutional oversight to deliver reliable coastal hazard intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 relative"
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Benefits */}
              <div className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Stats / Projected Impact Section */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Projected Impact</h3>
            <p className="text-indigo-100 max-w-2xl mx-auto">
              Samudra Prahari aims to empower coastal communities and disaster agencies with timely, verified data. Here are our projected metrics once live.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '500+', label: 'Citizen Reporters Engaged' },
              { stat: '1,000+', label: 'Coastal Alerts Tracked' },
              { stat: '200+', label: 'Social Media Sources Monitored' },
              { stat: '24/7', label: 'Continuous Data Collection' }
            ].map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{metric.stat}</div>
                <div className="text-indigo-100">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
