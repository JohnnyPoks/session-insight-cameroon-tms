
import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { useGetCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } from '../api/apiSlice';
import type { Course } from '../types';

const { Option } = Select;

const CoursesPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  const { data: courses, isLoading } = useGetCoursesQuery();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const departments = ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics', 'Chemistry'];

  const handleCreate = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id).unwrap();
      message.success('Course deleted successfully');
    } catch (error) {
      message.error('Failed to delete course');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, data: values }).unwrap();
        message.success('Course updated successfully');
      } else {
        await createCourse(values).unwrap();
        message.success('Course created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save course');
    }
  };

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
      sorter: (a: Course, b: Course) => a.courseCode.localeCompare(b.courseCode),
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
      sorter: (a: Course, b: Course) => a.courseName.localeCompare(b.courseName),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => (
        <Tag color="blue">{department}</Tag>
      ),
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value: any, record: Course) => record.department === value,
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      sorter: (a: Course, b: Course) => a.credits - b.credits,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (course: Course) => (
        <Space>
          <Button
            size="small"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEdit(course)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(course.id)}
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
            <BookOpen className="w-6 h-6" />
            Courses Management
          </h1>
          <p className="text-gray-600">Manage course catalog and curriculum</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
          className="bg-primary-500 hover:bg-primary-600"
        >
          Add Course
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={courses}
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
        title={editingCourse ? 'Edit Course' : 'Add Course'}
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
              name="courseCode"
              label="Course Code"
              rules={[{ required: true, message: 'Please enter course code' }]}
            >
              <Input placeholder="e.g., CS101" />
            </Form.Item>

            <Form.Item
              name="credits"
              label="Credits"
              rules={[{ required: true, message: 'Please enter credits' }]}
            >
              <Input type="number" placeholder="Credits" />
            </Form.Item>
          </div>

          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[{ required: true, message: 'Please enter course name' }]}
          >
            <Input placeholder="Course name" />
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
              {editingCourse ? 'Update' : 'Create'} Course
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursesPage;
