
import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../api/apiSlice';
import { loginSuccess } from '../features/auth/authSlice';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const result = await login(values).unwrap();
      dispatch(loginSuccess(result));
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Text className="text-white font-bold text-xl">TMS</Text>
          </div>
          <Title level={2} className="mb-2">Teaching Management System</Title>
          <Text className="text-gray-600">Session-level evaluation for Cameroonian universities</Text>
        </div>

        <Card className="shadow-lg border-0">
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<User className="w-4 h-4 text-gray-400" />}
                placeholder="Enter your username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
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
                className="w-full h-12 bg-primary-500 hover:bg-primary-600 border-0"
                loading={isLoading}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Text className="text-sm font-medium block mb-2 text-blue-900">Demo Login Credentials:</Text>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <strong>Dean:</strong> 
                <span>dean@example.com</span>
              </div>
              <div className="flex justify-between">
                <strong>HOD CS:</strong> 
                <span>hod.computerscience@example.com</span>
              </div>
              <div className="flex justify-between">
                <strong>HOD EE:</strong> 
                <span>hod.electricalengineering@example.com</span>
              </div>
              <div className="flex justify-between">
                <strong>Password:</strong> 
                <span className="text-green-700 font-medium">Any password works!</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
              <strong>Student Feedback:</strong> Use matriculation numbers like STU2024001, STU2024002, etc.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
