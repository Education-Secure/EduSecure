import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Briefcase, ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';
import AIImage from "../assets/AI.jpeg";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  const handleGoToDashboard = () => {
    window.location.href = '/index';
  };

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  const handleSignUp = () => {
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="text-lg text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-black bg-opacity-80 backdrop-blur-md border-b border-blue-400 border-opacity-20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-wide">SkillTracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={handleLogin}
                    className="text-gray-300 hover:text-blue-400 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-700 hover:bg-opacity-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with AI Education Background - Full Image Display */}
      <div className="relative overflow-hidden min-h-screen">
        {/* Background Image - Full Visibility */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${AIImage})`
          }}
        ></div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive AI-powered tools and resources designed for modern professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">AI-Powered Learning</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Personalized learning paths powered by advanced AI that adapts to your pace, style, and career goals
              </p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Expert-Led Courses</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Learn from industry leaders and top professionals with hands-on projects and real-world applications
              </p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Career Opportunities</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Access exclusive job opportunities from our network of 500+ partner companies worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-gray-100 py-24 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Trusted by Leading Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="flex items-center justify-center">
              <div className="w-24 h-12 bg-white border border-gray-300 rounded flex items-center justify-center shadow-sm">
                <span className="font-semibold text-gray-600">TECH</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-24 h-12 bg-white border border-gray-300 rounded flex items-center justify-center shadow-sm">
                <span className="font-semibold text-gray-600">CORP</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-24 h-12 bg-white border border-gray-300 rounded flex items-center justify-center shadow-sm">
                <span className="font-semibold text-gray-600">LABS</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-24 h-12 bg-white border border-gray-300 rounded flex items-center justify-center shadow-sm">
                <span className="font-semibold text-gray-600">PLUS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black from-opacity-20 via-transparent to-black to-opacity-20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 bg-opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 bg-opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 bg-black bg-opacity-40 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400 border-opacity-30 mb-8 shadow-lg">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">Join 50,000+ Successful Learners</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto drop-shadow-sm">
            Start your journey today with a free account and unlock access to premium AI-powered learning resources
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleGetStarted}
                className="group bg-white text-gray-800 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Start Learning Today</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleLogin}
                className="border-2 border-white border-opacity-50 text-white hover:bg-white hover:bg-opacity-10 hover:border-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm shadow-lg"
              >
                Sign In Instead
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold tracking-wide">SkillTracker</h3>
            </div>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Empowering careers through AI-powered continuous learning and professional development
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <span>© 2024 SkillTracker</span>
              <span>•</span>
              <span className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;