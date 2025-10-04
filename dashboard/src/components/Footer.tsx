import React from 'react';
import { Globe2, Github, Twitter, Linkedin, Mail, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Globe2 className="h-8 w-8 text-cyan-400" />
              <span className="font-bold text-xl">Samudra Prahari</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering coastal communities and disaster agencies with real-time,
              verified coastal hazard intelligence. Resilient, accurate, and reliable
              even during network disruptions.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: 'https://github.com/nikhil-r0/samudra-web' },
                { icon: Youtube, href: 'https://youtu.be/5G5odwkGp0A?si=A4jONqhfPbr15DXN' }

              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-800 p-2 rounded-lg hover:bg-cyan-500 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <nav className="space-y-2">
              {['Home', 'How It Works', 'Features', 'Demo', 'Contact'].map((link) => (
                <button
                  key={link}
                  onClick={() => document.getElementById(link.toLowerCase().replace(' & ', '-').replace(' ', '-'))?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  {link}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-indigo-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Samudra Prahari. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
