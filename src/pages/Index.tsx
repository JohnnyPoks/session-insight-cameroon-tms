
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BarChart3 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Teaching Management System
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Session-level teaching evaluation system for continuous pedagogical improvement in Cameroonian universities
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
            <p className="text-gray-600 text-sm">
              Dean, HOD, and Student roles with appropriate permissions and interfaces
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive analytics with SEI calculations and performance tracking
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Session Management</h3>
            <p className="text-gray-600 text-sm">
              Complete session lifecycle management with feedback collection
            </p>
          </div>
        </div>

        <div className="space-x-4">
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/login')}
            className="bg-primary-500 hover:bg-primary-600 h-12 px-8"
          >
            Sign In
          </Button>
          <Button 
            size="large" 
            onClick={() => navigate('/feedback/demo-session')}
            className="h-12 px-8"
          >
            Try Demo Feedback
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Demo Accounts: dean@example.com, hod.computerscience@example.com (password: any value)</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
