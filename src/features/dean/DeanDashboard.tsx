
import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Progress, Table, Tag, DatePicker, Select, Button, Space } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, DoughnutChart, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, FileText, Building, GraduationCap, Award, Download } from 'lucide-react';
import { useGetOverviewAnalyticsQuery, useGetSessionsQuery, useGetCoursesQuery, useGetLecturersQuery } from '../../api/apiSlice';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DeanDashboard: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [dateRange, setDateRange] = useState([]);

  const { data: analytics, isLoading: analyticsLoading } = useGetOverviewAnalyticsQuery();
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionsQuery();
  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery();
  const { data: lecturers, isLoading: lecturersLoading } = useGetLecturersQuery();

  // Mock data for faculty-wide analytics
  const facultyTrendData = [
    { month: 'Jan', sei: 3.8, responses: 2400 },
    { month: 'Feb', sei: 4.0, responses: 2600 },
    { month: 'Mar', sei: 4.2, responses: 2800 },
    { month: 'Apr', sei: 4.1, responses: 2650 },
    { month: 'May', sei: 4.3, responses: 2900 },
    { month: 'Jun', sei: 4.4, responses: 3100 }
  ];

  const departmentComparisonData = [
    { department: 'Computer Science', sei: 4.2 },
    { department: 'Mathematics', sei: 3.9 },
    { department: 'Physics', sei: 4.0 },
    { department: 'Chemistry', sei: 3.8 },
    { department: 'Biology', sei: 4.1 }
  ];

  const responseDistributionData = [
    { name: 'Excellent (5)', value: 35, color: '#52c41a' },
    { name: 'Good (4)', value: 30, color: '#1890ff' },
    { name: 'Average (3)', value: 20, color: '#faad14' },
    { name: 'Poor (2)', value: 10, color: '#fa8c16' },
    { name: 'Very Poor (1)', value: 5, color: '#f5222d' }
  ];

  const dimensionScoresData = [
    { dimension: 'Clarity', score: 4.2 },
    { dimension: 'Engagement', score: 4.0 },
    { dimension: 'Methods', score: 3.9 },
    { dimension: 'Content', score: 4.1 },
    { dimension: 'Learning', score: 4.0 }
  ];

  const engagementData = [
    { department: 'Computer Science', engagement: 4.3, faculty_avg: 4.0 },
    { department: 'Mathematics', engagement: 3.7, faculty_avg: 4.0 },
    { department: 'Physics', engagement: 4.1, faculty_avg: 4.0 },
    { department: 'Chemistry', engagement: 3.6, faculty_avg: 4.0 },
    { department: 'Biology', engagement: 4.2, faculty_avg: 4.0 }
  ];

  const topSessions = [
    { key: '1', rank: 1, course: 'CS101 - Intro to Programming', instructor: 'Dr. Smith', department: 'Computer Science', sei: 4.8, responses: 45 },
    { key: '2', rank: 2, course: 'MATH201 - Calculus II', instructor: 'Dr. Johnson', department: 'Mathematics', sei: 4.7, responses: 38 },
    { key: '3', rank: 3, course: 'PHY301 - Quantum Physics', instructor: 'Dr. Brown', department: 'Physics', sei: 4.6, responses: 42 }
  ];

  const sessionColumns = [
    { title: 'Rank', dataIndex: 'rank', key: 'rank', width: 70 },
    { title: 'Course', dataIndex: 'course', key: 'course' },
    { title: 'Instructor', dataIndex: 'instructor', key: 'instructor' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { 
      title: 'SEI', 
      dataIndex: 'sei', 
      key: 'sei',
      render: (sei: number) => (
        <Tag color={sei >= 4.5 ? 'green' : sei >= 4.0 ? 'blue' : sei >= 3.5 ? 'orange' : 'red'}>
          {sei.toFixed(1)}
        </Tag>
      )
    },
    { title: 'Responses', dataIndex: 'responses', key: 'responses' }
  ];

  const handleExportReport = () => {
    console.log('Exporting faculty report...');
  };

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const instructors = lecturers?.map(l => ({ label: l.name, value: l.id })) || [];
  const courseOptions = courses?.map(c => ({ label: `${c.courseCode} - ${c.courseName}`, value: c.id })) || [];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <Title level={2} className="mb-1">Faculty Analytics Dashboard</Title>
          <Text className="text-gray-600">Comprehensive faculty-wide performance overview</Text>
        </div>
        
        <Space wrap className="flex-wrap">
          <Select
            placeholder="All Departments"
            style={{ width: 160 }}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={[
              { label: 'All Departments', value: 'all' },
              ...departments.map(dept => ({ label: dept, value: dept }))
            ]}
          />
          <Select
            placeholder="All Instructors"
            style={{ width: 160 }}
            value={selectedInstructor}
            onChange={setSelectedInstructor}
            options={[
              { label: 'All Instructors', value: 'all' },
              ...instructors
            ]}
            showSearch
          />
          <Select
            placeholder="All Courses"
            style={{ width: 160 }}
            value={selectedCourse}
            onChange={setSelectedCourse}
            options={[
              { label: 'All Courses', value: 'all' },
              ...courseOptions
            ]}
            showSearch
          />
          <RangePicker 
            value={dateRange}
            onChange={setDateRange}
          />
          <Button type="primary" icon={<Download className="w-4 h-4" />} onClick={handleExportReport}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Key Statistical Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Faculty Average SEI"
              value={4.1}
              precision={2}
              valueStyle={{ color: '#14B8A6' }}
              prefix={<TrendingUp className="w-4 h-4" />}
              suffix={
                <div className="text-xs">
                  <div>/ 5.0</div>
                  <div className="text-green-500">↑5.2% from last month</div>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Sessions (Faculty)"
              value={247}
              valueStyle={{ color: '#1E40AF' }}
              prefix={<Calendar className="w-4 h-4" />}
              suffix={<div className="text-xs">12 this week</div>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Feedback (Faculty)"
              value={8456}
              valueStyle={{ color: '#7C3AED' }}
              prefix={<FileText className="w-4 h-4" />}
              suffix={<div className="text-xs">1,234 this month</div>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Faculty Response Rate"
              value={78.5}
              precision={1}
              valueStyle={{ color: '#059669' }}
              prefix={<Users className="w-4 h-4" />}
              suffix={
                <div className="text-xs">
                  <div>%</div>
                  <div className="text-green-500">↑3.1% from last month</div>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Core Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="SEI Trend Over Time (Faculty-Wide)" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={facultyTrendData}>
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
          <Card title="Department Performance Comparison" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="sei" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Faculty Response Distribution" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={responseDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {responseDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Faculty Dimension Scores" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dimensionScoresData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dimension" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="score" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Engagement Hotspots/Coldspots" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="engagement" fill="#faad14" radius={[4, 4, 0, 0]} />
                <Bar dataKey="faculty_avg" fill="#d9d9d9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Ranking Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Top Performing Sessions (Faculty-Wide)">
            <Table
              columns={sessionColumns}
              dataSource={topSessions}
              pagination={{ pageSize: 10 }}
              size="middle"
              onRow={(record) => ({
                onClick: () => {
                  console.log('Navigate to session details:', record.key);
                }
              })}
              className="cursor-pointer"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DeanDashboard;
