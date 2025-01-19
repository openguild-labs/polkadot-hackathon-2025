'use client';
import React from 'react';
import { 
  Dumbbell, 
  Heart, 
  MessageCircle, 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

const AIFitnessFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div className="flex flex-col items-start space-y-4">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold">Wefit365 AI trainer</h2>
          </div>
          <p className="text-gray-300">
            Revolutionizing fitness with AI-powered personalized training and real-time form analysis.
          </p>
        </div>

        {/* Quick Links */}
        {/* <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition">Home</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Workouts</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">AI Coaching</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Progress Tracking</a></li>
          </ul>
        </div> */}

        {/* Contact & Social */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="https://wefit365.onrender.com" className="text-gray-300 hover:text-blue-500 transition">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://x.com/Wefit365Inc" className="text-gray-300 hover:text-blue-500 transition">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-300 hover:text-blue-500 transition">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-300 hover:text-blue-500 transition">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <a href="mailto:nhatlapross@gmail.com" className="hover:text-blue-500">
              nhatlapross@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-6 border-t border-gray-700 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Wefit365Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default AIFitnessFooter;