import React from 'react';

const Demo: React.FC = () => {
  return (
    <section id="demo" className="mt-20 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 text-gray-900">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4">Project Demo</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Watch a live demonstration of <span className="font-semibold">Samudra Prahari</span> in action — showing citizen reporting, AI verification, and the dashboard workflow.
        </p>
      </div>

      {/* Video Embed */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200 relative">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/5G5odwkGp0A?si=heSQ9ih6utXt8jt0"
            title="Samudra Prahari Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Demo;
