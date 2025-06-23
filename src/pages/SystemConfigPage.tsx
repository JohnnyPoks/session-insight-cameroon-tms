
import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Slider, Button, Table, Tag, Space, Modal, Select, message, Popconfirm } from 'antd';
import {Settings, Users, Sliders, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { SEIWeights, User } from '../types';

const { Option } = Select;

const SystemConfigPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [seiWeights, setSeiWeights] = useState<SEIWeights>({
    'Clarity & Organization': 30,
    'Student Engagement': 25,
    'Pedagogical Methods & Activities': 20,
    'Content Delivery & Subject Mastery': 15,
    'Perceived Learning Impact': 10
  });
  
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Mock HOD users data
  const [hodUsers, setHodUsers] = useState<User[]>([
    {
      id: '1',
      username: 'hod.computerscience@example.com',
      name: 'Dr. Sarah Johnson',
      role: 'hod',
      department: 'Computer Science'
    },
    {
      id: '2',
      username: 'hod.mathematics@example.com',
      name: 'Prof. Michael Chen',
      role: 'hod',
      department: 'Mathematics'
    },
    {
      id: '3',
      username: 'hod.physics@example.com',
      name: 'Dr. Emily Rodriguez',
      role: 'hod',
      department: 'Physics'
    }
  ]);

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electrical Engineering'];

  const handleWeightChange = (dimension: keyof SEIWeights, value: number) => {
    setSeiWeights(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const handleSaveWeights = () => {
    const total = Object.values(seiWeights).reduce((sum, weight) => sum + weight, 0);
    if (total !== 100) {
      message.error('Total weights must equal 100%');
      return;
    }
    message.success('SEI weights updated successfully');
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsUserModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsUserModalVisible(true);
  };

  const handleDeleteUser = (userId: string) => {
    setHodUsers(prev => prev.filter(user => user.id !== userId));
    message.success('User deleted successfully');
  };

  const handleUserSubmit = (values: any) => {
    if (editingUser) {
      setHodUsers(prev => prev.map(user => 
        user.id === editingUser.id ? { ...user, ...values } : user
      ));
      message.success('User updated successfully');
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...values,
        role: 'hod' as const
      };
      setHodUsers(prev => [...prev, newUser]);
      message.success('User created successfully');
    }
    setIsUserModalVisible(false);
    form.resetFields();
  };

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag color="blue">{dept}</Tag>
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="green">{role.toUpperCase()}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (user: User) => (
        <Space>
          <Button
            size="small"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEditUser(user)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(user.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Only show this page to Dean users
  if (user?.role !== 'dean') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600">Access Denied</h2>
          <p className="text-gray-500">Only Dean users can access system configuration.</p>
        </div>
      </div>
    );
  }

  const totalWeight = Object.values(seiWeights).reduce((sum, weight) => sum + weight, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            System Configuration
          </h1>
          <p className="text-gray-600">Configure system-wide settings and parameters</p>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* SEI Weights Configuration */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span className="flex items-center gap-2"><Sliders className="w-4 h-4" /> SEI Weights Configuration</span>}
            extra={
              <Button 
                type="primary" 
                icon={<Save className="w-4 h-4" />} 
                onClick={handleSaveWeights}
                disabled={totalWeight !== 100}
                className="bg-primary-500 hover:bg-primary-600"
              >
                Save Weights
              </Button>
            }
          >
            <div className="space-y-6">
              {Object.entries(seiWeights).map(([dimension, weight]) => (
                <div key={dimension}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">{dimension}</label>
                    <span className="text-sm font-bold text-primary-500">{weight}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={50}
                    value={weight}
                    onChange={(value) => handleWeightChange(dimension as keyof SEIWeights, value)}
                    tooltip={{ formatter: (value) => `${value}%` }}
                  />
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Weight:</span>
                  <span className={`font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalWeight}%
                  </span>
                </div>
                {totalWeight !== 100 && (
                  <p className="text-sm text-red-500 mt-1">
                    Weights must total exactly 100%
                  </p>
                )}
              </div>
            </div>
          </Card>
        </Col>

        {/* System Statistics */}
        <Col xs={24} lg={12}>
          <Card title="System Statistics">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>Total Departments</span>
                <span className="font-bold text-blue-600">{departments.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span>Active HOD Users</span>
                <span className="font-bold text-green-600">{hodUsers.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span>System Version</span>
                <span className="font-bold text-purple-600">v2.1.0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span>Last Updated</span>
                <span className="font-bold text-orange-600">Today</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* User Management */}
      <Card 
        title={<span className="flex items-center gap-2"><Users className="w-4 h-4" /> HOD User Management</span>}
        extra={
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreateUser}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Add HOD User
          </Button>
        }
      >
        <Table
          columns={userColumns}
          dataSource={hodUsers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* User Modal */}
      <Modal
        title={editingUser ? 'Edit HOD User' : 'Add HOD User'}
        open={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUserSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username (Email)"
            rules={[
              { required: true, message: 'Please enter username' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <Select placeholder="Select department">
              {departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsUserModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="bg-primary-500 hover:bg-primary-600"
            >
              {editingUser ? 'Update' : 'Create'} User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemConfigPage;
