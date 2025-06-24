
import React from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const { Title, Text } = Typography;

const UserRegistrationPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      // Simulate registration API call
      console.log('Registration data:', values);
      message.success('Registration successful! Your account will be reviewed by the Dean for role assignment.');
      form.resetFields();
    } catch (error) {
      message.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <Title level={2} className="mb-2">Create Account</Title>
          <Text className="text-gray-600">
            Register for Teaching Management System access
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your full name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input 
              prefix={<User className="w-4 h-4 text-gray-400" />}
              placeholder="Enter your full name"
            />
          </Form.Item>

          <Form.Item
            name="username"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input 
              prefix={<Mail className="w-4 h-4 text-gray-400" />}
              placeholder="Enter your email address"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              prefix={<Lock className="w-4 h-4 text-gray-400" />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<Lock className="w-4 h-4 text-gray-400" />}
              placeholder="Confirm your password"
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full bg-primary-500 hover:bg-primary-600"
              size="large"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Text className="text-xs text-gray-500">
            After registration, your account will be reviewed by the Dean<br/>
            for role assignment and department allocation.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default UserRegistrationPage;
