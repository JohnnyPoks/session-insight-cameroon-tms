
import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Upload, Form, Select, message, Popconfirm } from 'antd';
import { Users, Plus, Upload as UploadIcon, Download, Trash2, FileSpreadsheet } from 'lucide-react';
import { useGetStudentsQuery, useUploadStudentListMutation, useGetCoursesQuery } from '../api/apiSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const { Option } = Select;
const { Dragger } = Upload;

interface Student {
  id: string;
  matriculationNumber: string;
  name: string;
  email: string;
  level: string;
  coursesRegistered: string[];
}

const StudentsPage: React.FC = () => {
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: students, isLoading } = useGetStudentsQuery();
  const { data: courses } = useGetCoursesQuery();
  const [uploadStudentList, { isLoading: uploading }] = useUploadStudentListMutation();

  // Filter courses by department for HOD
  const departmentCourses = user?.role === 'hod' 
    ? courses?.filter(course => course.department === user.department)
    : courses;

  const handleUpload = () => {
    setIsUploadModalVisible(true);
    form.resetFields();
  };

  const handleUploadSubmit = async (values: any) => {
    if (!values.file || !values.courseId || !values.level) {
      message.error('Please select course, level, and file');
      return;
    }

    try {
      await uploadStudentList({
        courseId: values.courseId,
        level: values.level,
        file: values.file.file
      }).unwrap();
      
      message.success('Student list uploaded successfully');
      setIsUploadModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to upload student list');
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Matriculation Number,Student Name,Email,Level\nSTU2024001,John Doe,john.doe@student.edu,100\nSTU2024002,Jane Smith,jane.smith@student.edu,200";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: 'Matriculation Number',
      dataIndex: 'matriculationNumber',
      key: 'matriculationNumber',
      sorter: (a: Student, b: Student) => a.matriculationNumber.localeCompare(b.matriculationNumber),
    },
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Student, b: Student) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color="blue">Level {level}</Tag>
      ),
      filters: [
        { text: 'Level 100', value: '100' },
        { text: 'Level 200', value: '200' },
        { text: 'Level 300', value: '300' },
        { text: 'Level 400', value: '400' },
      ],
      onFilter: (value: any, record: Student) => record.level === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (student: Student) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to remove this student?"
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<Trash2 className="w-4 h-4" />}
            >
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv,.xlsx,.xls',
    beforeUpload: () => false,
    onChange: (info: any) => {
      form.setFieldsValue({ file: info });
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Student Management
          </h1>
          <p className="text-gray-600">Manage student enrollment and course registration</p>
        </div>
        <Space>
          <Button
            icon={<Download className="w-4 h-4" />}
            onClick={downloadTemplate}
          >
            Download Template
          </Button>
          <Button
            type="primary"
            icon={<UploadIcon className="w-4 h-4" />}
            onClick={handleUpload}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Upload Student List
          </Button>
        </Space>
      </div>

      <Card>
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-blue-600">{students?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {students?.filter(s => s.level === '100').length || 0}
              </div>
              <div className="text-sm text-gray-600">Level 100</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {students?.filter(s => s.level === '200').length || 0}
              </div>
              <div className="text-sm text-gray-600">Level 200</div>
            </Card>
            <Card size="small" className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {students?.filter(s => s.level === '300').length || 0}
              </div>
              <div className="text-sm text-gray-600">Level 300+</div>
            </Card>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={students}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title="Upload Student List"
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUploadSubmit}
          className="mt-4"
        >
          <Form.Item
            name="courseId"
            label="Select Course"
            rules={[{ required: true, message: 'Please select a course' }]}
          >
            <Select placeholder="Select course for student enrollment" showSearch>
              {departmentCourses?.map(course => (
                <Option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="Select Level"
            rules={[{ required: true, message: 'Please select a level' }]}
          >
            <Select placeholder="Select student level">
              <Option value="100">Level 100</Option>
              <Option value="200">Level 200</Option>
              <Option value="300">Level 300</Option>
              <Option value="400">Level 400</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload File"
            rules={[{ required: true, message: 'Please upload a file' }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-blue-500" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for .csv, .xlsx, .xls files. File should contain columns: 
                Matriculation Number, Student Name, Email, Level
              </p>
            </Dragger>
          </Form.Item>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-blue-900 mb-2">File Format Requirements:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Column 1: Matriculation Number (e.g., STU2024001)</li>
              <li>• Column 2: Student Name (e.g., John Doe)</li>
              <li>• Column 3: Email (e.g., john.doe@student.edu)</li>
              <li>• Column 4: Level (100, 200, 300, or 400)</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsUploadModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={uploading}
              className="bg-primary-500 hover:bg-primary-600"
            >
              Upload Students
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentsPage;
