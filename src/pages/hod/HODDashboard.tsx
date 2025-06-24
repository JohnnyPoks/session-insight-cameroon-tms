
import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Progress, Table, Tag, Select, DatePicker, Space } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Calendar, FileText, BookOpen, User } from 'lucide-react';
import { useGetOverviewAnalyticsQuery, useGetSessionsQuery, useGetCoursesQuery, useGetLecturersQuery, useGetStudentsQuery } from '../../api/apiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../app/store';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const HODDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  
  const { data: analytics, isLoading: analyticsLoading } = useGetOverviewAnalyticsQuery();
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionsQuery();
  const { data: courses } = useGetCoursesQuery();
  const { data: lecturers } = useGetLecturersQuery();
  const { data: students } = useGetStudentsQuery();

  // Filter data based on HOD's department
  const departmentCourses = courses?.filter(course => course.department === user?.department) || [];
  const departmentLecturers = lecturers?.filter(lecturer => lecturer.department === user?.department) || [];
  const departmentSessions = sessions?.filter(session => session.department === user?.department) || [];
  
  // Calculate unique students in department
  const departmentStudents = students?.filter(student => 
    student.coursesRegistered.some(courseId => 
      departmentCourses.some(course => course.id === courseId)
    )
  ) || [];

  // Mock trend data with filters
  const trendData = [
    { month: 'Jan', sei: 3.8, responses: 1200 },
    { month: 'Feb', sei: 4.0, responses: 1350 },
    { month: 'Mar', sei: 4.2, responses: 1400 },
    { month: 'Apr', sei: 4.1, responses: 1320 },
    { month: 'May', sei: 4.3, responses: 1450 },
    { month: 'Jun', sei: 4.4, responses: 1500 }
  ];

  // Dimension scores data
  const dimensionData = [
    { dimension: 'Clarity & Organization', score: 4.2 },
    { dimension: 'Student Engagement', score: 4.0 },
    { dimension: 'Pedagogical Methods', score: 4.1 },
    { dimension: 'Content Delivery', score: 4.3 },
    { dimension: 'Learning Impact', score: 4.0 }
  ];

  const recentSessions = departmentSessions?.slice(0, 5).map(session => ({
    key: session.id,
    course: `${session.courseCode} - ${session.courseName}`,
    instructor: session.instructorName,
    date: new Date(session.date).toLocaleDateString(),
    status: session.status,
    students: session.studentCount
  }));

  const handleSessionClick = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const statusColumns = [
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-1">
            Welcome back, {user?.name}
          </Title>
          <Text className="text-gray-600">
            Department: {user?.department} - Teaching evaluation overview
          </Text>
        </div>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Average SEI"
              value={analytics?.averageSEI || 0}
              precision={2}
              valueStyle={{ color: '#14B8A6' }}
              prefix={<TrendingUp className="w-4 h-4" />}
              suffix="/ 5.0"
            />
            <Progress 
              percent={(analytics?.averageSEI || 0) * 20} 
              showInfo={false} 
              strokeColor="#14B8A6"
              className="mt-2"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Courses"
              value={departmentCourses.length}
              valueStyle={{ color: '#1E40AF' }}
              prefix={<BookOpen className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Lecturers"
              value={departmentLecturers.length}
              valueStyle={{ color: '#7C3AED' }}
              prefix={<User className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Students"
              value={departmentStudents.length}
              valueStyle={{ color: '#059669' }}
              prefix={<Users className="w-4 h-4" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card title="Chart Filters" size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Select
              mode="multiple"
              placeholder="Select courses"
              style={{ width: '100%' }}
              value={selectedCourses}
              onChange={setSelectedCourses}
            >
              {departmentCourses.map(course => (
                <Option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              mode="multiple"
              placeholder="Select instructors"
              style={{ width: '100%' }}
              value={selectedInstructors}
              onChange={setSelectedInstructors}
            >
              {departmentLecturers.map(lecturer => (
                <Option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
        </Row>
      </Card>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="SEI Trend Over Time" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sei" 
                  stroke="#1E40AF" 
                  strokeWidth={3}
                  dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Dimension Scores" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dimensionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="dimension" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="score" fill="#14B8A6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Sessions */}
      <Card title="Recent Sessions" loading={sessionsLoading}>
        <Table
          columns={statusColumns}
          dataSource={recentSessions}
          pagination={false}
          size="middle"
          onRow={(record) => ({
            onClick: () => handleSessionClick(record.key),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>
    </div>
  );
};

export default HODDashboard;
