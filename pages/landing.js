import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Judge } from "@/entities/Judge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Award, Users, BarChart3, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState(null);
  const [loginCode, setLoginCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (type) => {
    if (!loginCode.trim()) {
      setError("Please enter your login code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const judges = await Judge.filter({ login_code: loginCode.trim() });
      
      if (judges.length === 0) {
        setError("Invalid login code. Please check and try again.");
        setIsLoading(false);
        return;
      }

      const judge = judges[0];
      
      // Check if admin access is required
      if (type === 'admin' && judge.role !== 'admin') {
        setError("You don't have admin privileges. Please use judge login.");
        setIsLoading(false);
        return;
      }

      // Store user session
      localStorage.setItem('sih_user', JSON.stringify({
        id: judge.id,
        name: judge.name,
        email: judge.email,
        role: judge.role
      }));

      // Navigate based on role
      if (judge.role === 'admin') {
        navigate(createPageUrl("AdminDashboard"));
      } else {
        navigate(createPageUrl("JudgeDashboard"));
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-2xl">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              SIH Internal Hackathon
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 font-light mb-2">
              KGiSL Institute of Technology
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-sm text-green-200 font-medium">
                Developed by IPS Tech Community
              </span>
            </div>
          </motion.div>

          {!loginType ? (
            // Login Type Selection
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
            >
              <Card 
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => setLoginType('judge')}
              >
                <CardHeader className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">Judge Login</CardTitle>
                  <p className="text-blue-200">
                    Access team evaluation and scoring interface
                  </p>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <div className="flex items-center justify-center text-blue-300">
                    <span className="mr-2">Continue as Judge</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => setLoginType('admin')}
              >
                <CardHeader className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">Admin Login</CardTitle>
                  <p className="text-blue-200">
                    Manage leaderboard and export results
                  </p>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <div className="flex items-center justify-center text-purple-300">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="mr-2">Admin Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Login Form
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    loginType === 'admin' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {loginType === 'admin' ? (
                      <BarChart3 className="w-8 h-8 text-white" />
                    ) : (
                      <Users className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">
                    {loginType === 'admin' ? 'Admin Login' : 'Judge Login'}
                  </CardTitle>
                  <p className="text-blue-200 text-sm">
                    Enter your login code to continue
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert className="bg-red-500/10 border-red-500/20">
                      <AlertDescription className="text-red-200">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div>
                    <Input
                      type="text"
                      placeholder="Enter your login code"
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin(loginType)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => handleLogin(loginType)}
                      disabled={isLoading}
                      className={`w-full py-3 text-white font-semibold ${
                        loginType === 'admin'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      }`}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setLoginType(null);
                        setLoginCode("");
                        setError("");
                      }}
                      className="w-full text-blue-200 hover:text-white hover:bg-white/10"
                    >
                      Back to Login Options
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Scoring</h3>
              <p className="text-blue-200 text-sm">
                Live evaluation and instant leaderboard updates
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics Dashboard</h3>
              <p className="text-blue-200 text-sm">
                Comprehensive results and performance insights
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Export Results</h3>
              <p className="text-blue-200 text-sm">
                Download detailed reports in Excel format
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}