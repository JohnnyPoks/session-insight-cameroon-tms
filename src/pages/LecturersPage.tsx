
import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { Users, Plus, Edit, Trash2, Mail } from 'lucide-react';
import { useGetLecturersQuery, useCreateLecturerMutation, useUpdateLecturerMutation, useDeleteLecturerMutation } from '../api/apiSlice';
import type { Lecturer } from '../types';

const { Option } = Select;

const LecturersPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);
  const [form] = Form.useForm();

  const { data: lecturers, isLoading } = useGetLecturersQuery();
  const [createLecturer] = useCreateLecturerMutation();
  const [updateLecturer] = useUpdateLecturerMutation();
  const [deleteLecturer] = useDeleteLecturerMutation();

  const departments = ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics', 'Chemistry'];
  const titles = ['Dr.', 'Prof.', 'Mr.', 'Ms.'];

  const handleCreate = () => {
    setEditingLecturer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (lecturer: Lecturer) => {
    setEditingLecturer(lecturer);
    form.setFieldsValue(lecturer);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLecturer(id).unwrap();
      message.success('Lecturer deleted successfully');
    } catch (error) {
      message.error('Failed to delete lecturer');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingLecturer) {
        await updateLecturer({ id: editingLecturer.id, data: values }).unwrap();
        message.success('Lecturer updated successfully');
      } else {
        await createLecturer(values).unwrap();
        message.success('Lecturer created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save lecturer');
    }
  };

  const columns = [
    {
      title: 'Name',
      key: 'fullName',
      render: (lecturer: Lecturer) => (
        <div>
          <div className="font-medium">{lecturer.title} {lecturer.name}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {lecturer.email}
          </div>
        </div>
      ),
      sorter: (a: Lecturer, b: Lecturer) => a.name.localeCompare(b.name),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => (
        <Tag color="green">{department}</Tag>
      ),
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value: any, record: Lecturer) => record.department === value,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <Tag color="purple">{title}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (lecturer: Lecturer) => (
        <Space>
          <Button
            size="small"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEdit(lecturer)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this lecturer?"
            onConfirm={() => handleDelete(lecturer.id)}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Lecturers Management
          </h1>
          <p className="text-gray-600">Manage faculty and teaching staff</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
          className="bg-primary-500 hover:bg-primary-600"
        >
          Add Lecturer
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={lecturers}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={editingLecturer ? 'Edit Lecturer' : 'Add Lecturer'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please select title' }]}
            >
              <Select placeholder="Select title">
                {titles.map(title => (
                  <Option key={title} value={title}>{title}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Full name" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input placeholder="Email address" />
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
            <Button onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="bg-primary-500 hover:bg-primary-600"
            >
              {editingLecturer ? 'Update' : 'Create'} Lecturer
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default LecturersPage;
