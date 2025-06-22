
import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, DatePicker, message, Popconfirm } from 'antd';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useGetSessionsQuery, useCreateSessionMutation, useUpdateSessionMutation, useDeleteSessionMutation, useGetCoursesQuery, useGetLecturersQuery } from '../api/apiSlice';
import type { Session } from '../types';
import dayjs from 'dayjs';

const { Option } = Select;

const SessionsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [form] = Form.useForm();

  const { data: sessions, isLoading } = useGetSessionsQuery();
  const { data: courses } = useGetCoursesQuery();
  const { data: lecturers } = useGetLecturersQuery();
  const [createSession] = useCreateSessionMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const handleCreate = () => {
    setEditingSession(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    form.setFieldsValue({
      ...session,
      date: dayjs(session.date),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id).unwrap();
      message.success('Session deleted successfully');
    } catch (error) {
      message.error('Failed to delete session');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const sessionData = {
        ...values,
        date: values.date.toISOString(),
        questionnaireId: 'default-questionnaire',
      };

      if (editingSession) {
        await updateSession({ id: editingSession.id, data: sessionData }).unwrap();
        message.success('Session updated successfully');
      } else {
        await createSession(sessionData).unwrap();
        message.success('Session created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save session');
    }
  };

  const columns = [
    {
      title: 'Course',
      key: 'course',
      render: (session: Session) => (
        <div>
          <div className="font-medium">{session.courseCode}</div>
          <div className="text-sm text-gray-500">{session.courseName}</div>
        </div>
      ),
    },
    {
      title: 'Instructor',
      dataIndex: 'instructorName',
      key: 'instructorName',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (session: Session) => (
        <div>
          <div>{new Date(session.date).toLocaleDateString()}</div>
          <div className="text-sm text-gray-500">{session.time}</div>
        </div>
      ),
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          scheduled: 'blue',
          open_for_feedback: 'green',
          closed: 'gray'
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (session: Session) => (
        <Space>
          <Button
            size="small"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEdit(session)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this session?"
            onConfirm={() => handleDelete(session.id)}
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
            <Calendar className="w-6 h-6" />
            Sessions Management
          </h1>
          <p className="text-gray-600">Manage teaching sessions and evaluation windows</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
          className="bg-primary-500 hover:bg-primary-600"
        >
          Create Session
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={sessions}
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
        title={editingSession ? 'Edit Session' : 'Create Session'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="courseCode"
              label="Course"
              rules={[{ required: true, message: 'Please select a course' }]}
            >
              <Select placeholder="Select course">
                {courses?.map(course => (
                  <Option key={course.id} value={course.courseCode}>
                    {course.courseCode} - {course.courseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="instructorName"
              label="Instructor"
              rules={[{ required: true, message: 'Please select an instructor' }]}
            >
              <Select placeholder="Select instructor">
                {lecturers?.map(lecturer => (
                  <Option key={lecturer.id} value={lecturer.name}>
                    {lecturer.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: 'Please enter time' }]}
            >
              <Input placeholder="e.g., 10:00 AM" />
            </Form.Item>

            <Form.Item
              name="studentCount"
              label="Expected Students"
              rules={[{ required: true, message: 'Please enter student count' }]}
            >
              <Input type="number" placeholder="Number of students" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Option value="scheduled">Scheduled</Option>
                <Option value="open_for_feedback">Open for Feedback</Option>
                <Option value="closed">Closed</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="bg-primary-500 hover:bg-primary-600"
            >
              {editingSession ? 'Update' : 'Create'} Session
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SessionsPage;
