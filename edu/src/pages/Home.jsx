import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust path as needed
import { Award, BookOpen, Briefcase, ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleGoToDashboard = () => {
    navigate('/index');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleSignUp = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-skill-primary rounded-full animate-pulse"></div>
          <div className="text-lg text-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-skill-background">
      {/* Navigation Bar */}
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--skill-primary))] to-[hsl(var(--skill-secondary))] rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">SkillTracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={handleLogin}
                    className="text-muted-foreground hover:text-foreground px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-secondary/50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="bg-[hsl(var(--skill-primary))] hover:bg-[hsl(var(--skill-primary))]/90 text-primary-foreground px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGoToDashboard}
                  className="bg-[hsl(var(--skill-primary))] hover:bg-[hsl(var(--skill-primary))]/90 text-primary-foreground px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-skill-background via-card to-secondary/20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-secondary/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                <div className="w-2 h-2 bg-[hsl(var(--skill-success))] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">Transform Your Career Today</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Master New{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--skill-primary))] to-[hsl(var(--skill-secondary))]">
                Skills
              </span>
              <br />
              Find Dream{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--skill-secondary))] to-[hsl(var(--accent))]">
                Jobs
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who are advancing their careers through personalized learning paths, 
              expert-curated courses, and AI-powered job matching.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="group bg-[hsl(var(--skill-primary))] hover:bg-[hsl(var(--skill-primary))]/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[hsl(var(--skill-primary))]/25 flex items-center justify-center space-x-2"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleLogin}
                  className="border-2 border-[hsl(var(--skill-primary))] text-[hsl(var(--skill-primary))] hover:bg-[hsl(var(--skill-primary))] hover:text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoToDashboard}
                className="group bg-[hsl(var(--skill-primary))] hover:bg-[hsl(var(--skill-primary))]/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[hsl(var(--skill-primary))]/25 flex items-center justify-center space-x-2"
              >
                <span>Continue Learning</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[hsl(var(--skill-primary))] mb-2">50K+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[hsl(var(--skill-secondary))] mb-2">1,200+</div>
              <div className="text-muted-foreground">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[hsl(var(--skill-success))] mb-2">95%</div>
              <div className="text-muted-foreground">Job Match Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-skill-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--skill-primary))] to-[hsl(var(--skill-secondary))]">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and resources designed for modern professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-card rounded-2xl p-8 border border-border hover:border-[hsl(var(--skill-primary))]/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[hsl(var(--skill-primary))]/5 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--skill-primary))] to-[hsl(var(--skill-secondary))] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 text-center">AI-Powered Learning</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Personalized learning paths powered by advanced AI that adapts to your pace, style, and career goals
              </p>
            </div>
            
            <div className="group bg-card rounded-2xl p-8 border border-border hover:border-[hsl(var(--skill-secondary))]/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[hsl(var(--skill-secondary))]/5 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--skill-secondary))] to-[hsl(var(--accent))] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 text-center">Expert-Led Courses</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Learn from industry leaders and top professionals with hands-on projects and real-world applications
              </p>
            </div>
            
            <div className="group bg-card rounded-2xl p-8 border border-border hover:border-[hsl(var(--skill-success))]/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[hsl(var(--skill-success))]/5 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--skill-success))] to-[hsl(var(--skill-warning))] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 text-center">Career Opportunities</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Access exclusive job opportunities from our network of 500+ partner companies worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-card py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">Trusted by Leading Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
            <div className="flex items-center justify-center">
              <div className="w-24 h-12 bg-muted rounded flex items-center justify-center">
                <span className="font-semibold text-muted-foreground">TECH</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-24 h-12 bg-muted rounded flex items-center justify-center">
                <span className="font-semibold text-muted-foreground">CORP</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-24 h-12 bg-muted rounded flex items-center justify-center">
                <span className="font-semibold text-muted-foreground">LABS</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-24 h-12 bg-muted rounded flex items-center justify-center">
                <span className="font-semibold text-muted-foreground">PLUS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-r from-[hsl(var(--skill-primary))] to-[hsl(var(--skill-secondary))] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Join 50,000+ Successful Learners</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Start your journey today with a free account and unlock access to premium learning resources
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleGetStarted}
                className="group bg-white text-[hsl(var(--skill-primary))] hover:bg-white/90 px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Start Learning Today</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleLogin}
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                Sign In Instead
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--skill-primary))] to-[hsl(var(--skill-secondary))] rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">SkillTracker</h3>
            </div>
            <p className="text-background/70 max-w-md mx-auto mb-8">
              Empowering careers through continuous learning and professional development
            </p>
            <div className="flex justify-center space-x-8 text-sm text-background/50">
              <span>© 2024 SkillTracker</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;