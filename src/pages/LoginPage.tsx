import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, BookOpen, Users } from 'lucide-react';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../api/apiSlice';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Invalid credentials. Please try again.');
    }
  };

  const handleDemoLogin = async (userType: 'hod' | 'dean') => {
    const demoCredentials = {
      hod: {
        username: 'hod.computerscience@example.com',
        password: 'demo'
      },
      dean: {
        username: 'dean@example.com', 
        password: 'demo'
      }
    };

    try {
      const result = await login(demoCredentials[userType]).unwrap();
      dispatch(setCredentials(result));
      message.success(`Logged in as Demo ${userType.toUpperCase()}!`);
      navigate('/dashboard');
    } catch (error) {
      message.error('Demo login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <Title level={2} className="mb-2">Teaching Management System</Title>
          <Text className="text-gray-600">Cameroon Universities</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="username"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<User className="w-4 h-4 text-gray-400" />}
              placeholder="Enter your email address"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password 
              prefix={<Lock className="w-4 h-4 text-gray-400" />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full bg-primary-500 hover:bg-primary-600"
              loading={isLoading}
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* <Divider>
          <Text className="text-gray-500 text-sm">Demo Access</Text>
        </Divider>

        <Space direction="vertical" className="w-full">
          <Button
            type="default"
            className="w-full"
            size="large"
            icon={<Users className="w-4 h-4" />}
            onClick={() => handleDemoLogin('hod')}
            loading={isLoading}
          >
            Log in as Demo HOD
          </Button>
          
          <Button
            type="default"
            className="w-full"
            size="large"
            icon={<User className="w-4 h-4" />}
            onClick={() => handleDemoLogin('dean')}
            loading={isLoading}
          >
            Log in as Demo Dean
          </Button>
        </Space> */}

        <div className="mt-6 text-center">
          {/* <Text className="text-xs text-gray-500">
            Demo Credentials Available:<br/>
            HOD: hod.computerscience@example.com<br/>
            Dean: dean@example.com<br/>
            (Any password works)
          </Text> */}
          <div className="mt-4">
            <Link to="/register">
              <Button type="link">Create an account</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
