
import React from 'react';
import { Card, Form, Input, Button, message, Descriptions } from 'antd';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

const DeanProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  const handlePasswordChange = async (values: any) => {
    try {
      // Simulate password change API call
      console.log('Password change data:', values);
      message.success('Password changed successfully!');
      form.resetFields();
    } catch (error) {
      message.error('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">My Profile</h2>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card title="Profile Information" className="h-fit">
          <Descriptions column={1} size="middle">
            <Descriptions.Item 
              label={
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </span>
              }
            >
              {user?.name}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </span>
              }
            >
              {user?.username}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </span>
              }
            >
              <span className="text-blue-600 font-medium">Dean</span>
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User ID
                </span>
              }
            >
              {user?.id}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Change Password */}
        <Card title="Change Password">
          <Form
            form={form}
            layout="vertical"
            onFinish={handlePasswordChange}
            requiredMark={false}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                { required: true, message: 'Please enter your current password' }
              ]}
            >
              <Input.Password 
                prefix={<Lock className="w-4 h-4 text-gray-400" />}
                placeholder="Enter current password"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                prefix={<Lock className="w-4 h-4 text-gray-400" />}
                placeholder="Enter new password"
              />
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<Lock className="w-4 h-4 text-gray-400" />}
                placeholder="Confirm new password"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Security Information */}
      <Card title="Security Information">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Account Security</h4>
              <p className="text-sm text-blue-700">
                Your account has Dean-level access to the Teaching Management System. 
                Please ensure your password is strong and secure. If you suspect any 
                unauthorized access, change your password immediately.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeanProfilePage;
