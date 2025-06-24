
import React, { useState } from 'react';
import { Card, Row, Col, Slider, Button, Table, Modal, Form, Select, Input, message, Popconfirm, Statistic } from 'antd';
import { Settings, Users, Database, Plus, Edit, Trash2 } from 'lucide-react';

const SystemConfigPage: React.FC = () => {
  const [weights, setWeights] = useState({
    clarity: 20,
    engagement: 20,
    methods: 20,
    content: 20,
    learning: 20
  });

  const [isHODModalVisible, setIsHODModalVisible] = useState(false);
  const [editingHOD, setEditingHOD] = useState(null);
  const [form] = Form.useForm();

  // Mock data for HOD users
  const [hodUsers, setHodUsers] = useState([
    { key: '1', name: 'Dr. John Smith', username: 'john.smith@university.edu', department: 'Computer Science', role: 'HOD' },
    { key: '2', name: 'Dr. Sarah Johnson', username: 'sarah.johnson@university.edu', department: 'Mathematics', role: 'HOD' },
    { key: '3', name: 'Dr. Mike Brown', username: 'mike.brown@university.edu', department: 'Physics', role: 'HOD' }
  ]);

  // Mock data for registered users without HOD role
  const registeredUsers = [
    { value: '4', label: 'Dr. Emily Davis - emily.davis@university.edu' },
    { value: '5', label: 'Dr. Robert Wilson - robert.wilson@university.edu' },
    { value: '6', label: 'Dr. Lisa Anderson - lisa.anderson@university.edu' }
  ];

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

  const handleWeightChange = (dimension: string, value: number) => {
    const remainingDimensions = Object.keys(weights).filter(key => key !== dimension);
    const currentTotal = Object.values(weights).reduce((sum, val) => sum + val, 0);
    const otherTotal = currentTotal - weights[dimension];
    const remaining = 100 - value;
    
    if (remaining >= 0 && remainingDimensions.length > 0) {
      const newWeights = { ...weights, [dimension]: value };
      
      // Distribute remaining weight proportionally among other dimensions
      const factor = remaining / otherTotal;
      remainingDimensions.forEach(dim => {
        newWeights[dim] = Math.round(weights[dim] * factor);
      });
      
      setWeights(newWeights);
    }
  };

  const handleSaveWeights = () => {
    const total = Object.values(weights).reduce((sum, val) => sum + val, 0);
    if (total === 100) {
      message.success('SEI weights saved successfully!');
    } else {
      message.error('Total weights must equal 100%');
    }
  };

  const handleAddHOD = () => {
    setEditingHOD(null);
    form.resetFields();
    setIsHODModalVisible(true);
  };

  const handleEditHOD = (record: any) => {
    setEditingHOD(record);
    form.setFieldsValue(record);
    setIsHODModalVisible(true);
  };

  const handleDeleteHOD = (key: string) => {
    setHodUsers(hodUsers.filter(user => user.key !== key));
    message.success('HOD user removed successfully');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingHOD) {
        // Edit existing HOD
        setHodUsers(hodUsers.map(user => 
          user.key === editingHOD.key ? { ...user, ...values } : user
        ));
        message.success('HOD user updated successfully');
      } else {
        // Add new HOD
        const selectedUser = registeredUsers.find(user => user.value === values.user);
        if (selectedUser) {
          const newHOD = {
            key: values.user,
            name: values.fullName,
            username: values.username,
            department: values.department,
            role: 'HOD'
          };
          setHodUsers([...hodUsers, newHOD]);
          message.success('HOD role assigned successfully');
        }
      }
      setIsHODModalVisible(false);
      form.resetFields();
    });
  };

  const hodColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: () => <span className="text-blue-600 font-medium">HOD</span> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button 
            type="text" 
            size="small" 
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEditHOD(record)}
          />
          <Popconfirm
            title="Remove HOD role?"
            description="This will remove the HOD role from this user."
            onConfirm={() => handleDeleteHOD(record.key)}
          >
            <Button 
              type="text" 
              size="small" 
              danger
              icon={<Trash2 className="w-4 h-4" />}
            />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">System Configuration</h2>
          <p className="text-gray-600">Manage system settings and user permissions</p>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* SEI Weights Configuration */}
        <Col xs={24} lg={16}>
          <Card title="SEI Weights Configuration" className="h-full">
            <div className="space-y-6">
              <p className="text-gray-600 mb-4">
                Adjust the percentage weights for each evaluation dimension. Total must equal 100%.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Clarity & Organization: {weights.clarity}%
                  </label>
                  <Slider
                    min={0}
                    max={100}
                    value={weights.clarity}
                    onChange={(value) => handleWeightChange('clarity', value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Student Engagement: {weights.engagement}%
                  </label>
                  <Slider
                    min={0}
                    max={100}
                    value={weights.engagement}
                    onChange={(value) => handleWeightChange('engagement', value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pedagogical Methods: {weights.methods}%
                  </label>
                  <Slider
                    min={0}
                    max={100}
                    value={weights.methods}
                    onChange={(value) => handleWeightChange('methods', value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content Delivery: {weights.content}%
                  </label>
                  <Slider
                    min={0}
                    max={100}
                    value={weights.content}
                    onChange={(value) => handleWeightChange('content', value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Learning Impact: {weights.learning}%
                  </label>
                  <Slider
                    min={0}
                    max={100}
                    value={weights.learning}
                    onChange={(value) => handleWeightChange('learning', value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-medium">
                  Total: {Object.values(weights).reduce((sum, val) => sum + val, 0)}%
                </span>
                <Button type="primary" onClick={handleSaveWeights}>
                  Save Weights
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        {/* System Statistics */}
        <Col xs={24} lg={8}>
          <div className="space-y-4">
            <Card>
              <Statistic
                title="Total Departments"
                value={5}
                prefix={<Database className="w-4 h-4" />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
            <Card>
              <Statistic
                title="Active HOD Users"
                value={hodUsers.length}
                prefix={<Users className="w-4 h-4" />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
            <Card>
              <Statistic
                title="System Version"
                value="v2.1.0"
                prefix={<Settings className="w-4 h-4" />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
            <Card>
              <div>
                <div className="text-gray-500 text-sm">Last Updated</div>
                <div className="text-xl font-semibold">Dec 24, 2024</div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* HOD User Management */}
      <Card 
        title="HOD User Management"
        extra={
          <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAddHOD}>
            Add HOD User
          </Button>
        }
      >
        <Table
          columns={hodColumns}
          dataSource={hodUsers}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      {/* Add/Edit HOD Modal */}
      <Modal
        title={editingHOD ? 'Edit HOD User' : 'Add HOD User'}
        open={isHODModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsHODModalVisible(false)}
        okText={editingHOD ? 'Update' : 'Assign HOD Role & Save'}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          {!editingHOD && (
            <Form.Item
              name="user"
              label="Select User"
              rules={[{ required: true, message: 'Please select a user' }]}
            >
              <Select
                placeholder="Search and select a registered user"
                showSearch
                options={registeredUsers}
                onChange={(value) => {
                  const selectedUser = registeredUsers.find(user => user.value === value);
                  if (selectedUser) {
                    const [name, email] = selectedUser.label.split(' - ');
                    form.setFieldsValue({
                      fullName: name,
                      username: email
                    });
                  }
                }}
              />
            </Form.Item>
          )}
          
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input readOnly={!editingHOD} />
          </Form.Item>
          
          <Form.Item
            name="username"
            label="Username (Email)"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input readOnly />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <Select
              placeholder="Select department"
              options={departments.map(dept => ({ label: dept, value: dept }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemConfigPage;
