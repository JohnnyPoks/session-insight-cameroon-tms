import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, DatePicker, TimePicker, message, Popconfirm } from 'antd';
import { Calendar, Plus, Edit, Trash2, Users } from 'lucide-react';
import { useGetSessionsQuery, useCreateSessionMutation, useUpdateSessionMutation, useDeleteSessionMutation, useGetCoursesQuery, useGetLecturersQuery, useGetQuestionnairesQuery } from '../api/apiSlice';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface Session {
  id: string;
  courseCode: string;
  courseName: string;
  instructorName: string;
  department: string;
  date: string;
  time: string;
  studentCount: number;
  status: 'scheduled' | 'open_for_feedback' | 'closed';
  questionnaireId: string;
  evaluationStart?: string;
  evaluationEnd?: string;
  studentLevel?: string;
}

const SessionsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: sessions, isLoading } = useGetSessionsQuery();
  const { data: courses } = useGetCoursesQuery();
  const { data: lecturers } = useGetLecturersQuery();
  const { data: questionnaires } = useGetQuestionnairesQuery();
  const [createSession] = useCreateSessionMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  // Helper to get department from course
  const getDepartmentForCourse = (courseCode: string) => {
    const course = courses?.find((c) => c.courseCode === courseCode);
    return course ? course.department : '';
  };

  const handleCreate = () => {
    setEditingSession(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    form.setFieldsValue({
      ...session,
      date: session.date ? dayjs(session.date) : null,
      time: session.time ? dayjs(session.time, 'HH:mm') : null,
      studentLevel: session.studentLevel || undefined,
      questionnaireId: session.questionnaireId || undefined,
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
      const department = getDepartmentForCourse(values.courseCode);
      const sessionData = {
        ...values,
        department,
        date: values.date ? values.date.toISOString() : new Date().toISOString(),
        time: values.time ? values.time.format('HH:mm') : '10:00',
        studentCount: parseInt(values.studentCount) || 0,
        questionnaireId: values.questionnaireId,
        studentLevel: values.studentLevel,
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

  // 1. Make each session row clickable
  const onRow = (record: Session) => ({
    onClick: () => navigate(`/sessions/${record.id}`),
    style: { cursor: 'pointer' },
    className: 'hover:bg-gray-50',
  });

  const columns = [
    {
      title: 'Course',
      key: 'course',
      render: (session: Session) => (
        <div>
          <div className="font-semibold">{session.courseCode}</div>
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
      render: (department: string) => (
        <Tag color="blue">{department}</Tag>
      ),
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
      render: (count: number) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {count}
        </div>
      ),
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
        <Space onClick={e => e.stopPropagation()}>
          <Button
            size="small"
            icon={<Edit className="w-4 h-4" />}
            onClick={e => { e.stopPropagation(); handleEdit(session); }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this session?"
            onConfirm={e => { e && e.stopPropagation(); handleDelete(session.id); }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<Trash2 className="w-4 h-4" />}
              onClick={e => e.stopPropagation()}
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
            Session Management
          </h1>
          <p className="text-gray-600">Schedule and manage teaching sessions</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
          className="bg-primary-500 hover:bg-primary-600"
        >
          Schedule Session
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
          onRow={onRow}
        />
      </Card>

      <Modal
        title={editingSession ? 'Edit Session' : 'Schedule Session'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
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
              <Select
                placeholder="Select course"
                onChange={(value) => {
                  const course = courses?.find((c) => c.courseCode === value);
                  form.setFieldsValue({
                    courseName: course?.courseName,
                    department: course?.department,
                  });
                }}
              >
                {courses?.map((course) => (
                  <Option key={course.courseCode} value={course.courseCode}>
                    {course.courseCode} - {course.courseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="instructorName"
              label="Lecturer"
              rules={[{ required: true, message: 'Please select a lecturer' }]}
            >
              <Select placeholder="Select lecturer">
                {lecturers?.map((lecturer) => (
                  <Option key={lecturer.name} value={lecturer.name}>
                    {lecturer.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="courseName"
            label="Course Name"
            style={{ display: 'none' }}
          >
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            style={{ display: 'none' }}
          >
            <Input type="hidden" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select date' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: 'Please select time' }]}
            >
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>

            <Form.Item
              name="studentCount"
              label="Expected Students"
              rules={[{ required: true, message: 'Please enter student count' }]}
            >
              <Input type="number" placeholder="Number of students" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <Form.Item
              name="questionnaireId"
              label="Questionnaire"
              rules={[{ required: true, message: 'Please select a questionnaire' }]}
            >
              <Select placeholder="Select questionnaire">
                {questionnaires?.map((q) => (
                  <Option key={q.id} value={q.id}>{q.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="studentLevel"
            label="Student Level"
            rules={[{ required: true, message: 'Please select student level' }]}
          >
            <Select placeholder="Select student level">
              <Option value="100">100</Option>
              <Option value="200">200</Option>
              <Option value="300">300</Option>
              <Option value="400">400</Option>
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
              {editingSession ? 'Update' : 'Schedule'} Session
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SessionsPage;
