import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Button, Select, DatePicker, Space } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Calendar, FileText, BookOpen, UserCheck, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetOverviewAnalyticsQuery, useGetSessionsQuery, useGetCoursesQuery, useGetLecturersQuery, useGetStudentsQuery } from '../../api/apiSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const HODDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [selectedInstructor, setSelectedInstructor] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<any>(null);

  const { data: analytics, isLoading: analyticsLoading } = useGetOverviewAnalyticsQuery();
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionsQuery();
  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery();
  const { data: lecturers, isLoading: lecturersLoading } = useGetLecturersQuery();
  const { data: students, isLoading: studentsLoading } = useGetStudentsQuery();

  // Filter data based on user's department
  const departmentCourses = courses?.filter(course => course.department === user?.department) || [];
  const departmentLecturers = lecturers?.filter(lecturer => lecturer.department === user?.department) || [];
  const departmentSessions = sessions?.filter(session => session.department === user?.department) || [];

  // Calculate department-specific statistics
  const departmentStudents = students?.filter(student => 
    student.coursesRegistered?.some((courseId: string) => 
      departmentCourses.some(course => course.id === courseId)
    )
  ) || [];

  // Mock trend data with safe numeric values
  const trendData = [
    { month: 'Jan', sei: 3.8, responses: 120 },
    { month: 'Feb', sei: 4.0, responses: 135 },
    { month: 'Mar', sei: 4.2, responses: 140 },
    { month: 'Apr', sei: 4.1, responses: 132 },
    { month: 'May', sei: 4.3, responses: 145 },
    { month: 'Jun', sei: 4.4, responses: 150 }
  ];

  // Mock dimension scores data with safe numeric values
  const dimensionData = [
    { dimension: 'Clarity & Organization', score: 4.2 },
    { dimension: 'Student Engagement', score: 4.0 },
    { dimension: 'Pedagogical Methods', score: 4.1 },
    { dimension: 'Content Delivery', score: 4.3 },
    { dimension: 'Learning Impact', score: 4.0 }
  ];

  const recentSessions = departmentSessions.slice(0, 5).map(session => ({
    key: session.id,
    course: `${session.courseCode} - ${session.courseName}`,
    instructor: session.instructorName,
    date: new Date(session.date).toLocaleDateString(),
    status: session.status,
    students: session.studentCount || 0
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
            HOD Dashboard - {user?.department}
          </Title>
          <Text className="text-gray-600">
            Comprehensive overview of your department's teaching evaluations
          </Text>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Average SEI"
              value={Number(analytics?.averageSEI) || 0}
              precision={2}
              valueStyle={{ color: '#14B8A6' }}
              prefix={<TrendingUp className="w-4 h-4" />}
              suffix="/ 5.0"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Courses in Department"
              value={departmentCourses.length}
              valueStyle={{ color: '#1E40AF' }}
              prefix={<BookOpen className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Lecturers in Department"
              value={departmentLecturers.length}
              valueStyle={{ color: '#7C3AED' }}
              prefix={<UserCheck className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Students Enrolled"
              value={departmentStudents.length}
              valueStyle={{ color: '#059669' }}
              prefix={<GraduationCap className="w-4 h-4" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      {/* <Card title="Chart Filters">
        <Space wrap>
          <div>
            <Text strong>Course: </Text>
            <Select
              style={{ width: 200 }}
              placeholder="Select course"
              allowClear
              value={selectedCourse}
              onChange={setSelectedCourse}
              loading={coursesLoading}
            >
              {departmentCourses.map(course => (
                <Select.Option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName}
                </Select.Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Text strong>Instructor: </Text>
            <Select
              style={{ width: 200 }}
              placeholder="Select instructor"
              allowClear
              value={selectedInstructor}
              onChange={setSelectedInstructor}
              loading={lecturersLoading}
            >
              {departmentLecturers.map(lecturer => (
                <Select.Option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Text strong>Date Range: </Text>
            <RangePicker 
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        </Space>
      </Card> */}

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="SEI Trend Over Time" style={{height: 400}}>
            <ResponsiveContainer width="100%" height={300}>
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
          <Card title="Monthly Responses" style={{height: 400}}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responses" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* New Dimension Scores Chart */}
      <Card title="Dimension Scores (Grouped by Dimension)" style={{height: 450}}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={[
            { dimension: 'Clarity & Organization', score: 4.2 },
            { dimension: 'Student Engagement', score: 4.0 },
            { dimension: 'Pedagogical Methods', score: 4.1 },
            { dimension: 'Content Delivery', score: 4.3 },
            { dimension: 'Learning Impact', score: 4.0 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dimension" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="score" fill="#14B8A6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Sessions with clickable rows */}
      <Card title="Recent Sessions" loading={sessionsLoading}>
        <Table
          columns={statusColumns}
          dataSource={recentSessions}
          pagination={false}
          size="middle"
          onRow={(record) => ({
            onClick: () => handleSessionClick(record.key),
            style: { cursor: 'pointer' },
            className: 'hover:bg-gray-50'
          })}
        />
      </Card>
    </div>
  );
};

export default HODDashboard;
