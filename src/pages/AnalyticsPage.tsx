
import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Tag, Space } from 'antd';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, Filter, BarChart3 } from 'lucide-react';
import { useGetOverviewAnalyticsQuery, useGetSessionsQuery } from '../api/apiSlice';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    department: 'all',
    dateRange: null as any,
    instructor: 'all'
  });

  const { data: analytics } = useGetOverviewAnalyticsQuery();
  const { data: sessions } = useGetSessionsQuery();

  // Mock detailed analytics data
  const dimensionScores = [
    { dimension: 'Clarity & Organization', score: 4.2, color: '#1E40AF' },
    { dimension: 'Student Engagement', score: 3.8, color: '#14B8A6' },
    { dimension: 'Pedagogical Methods', score: 4.0, color: '#7C3AED' },
    { dimension: 'Content Delivery', score: 4.1, color: '#F59E0B' },
    { dimension: 'Learning Impact', score: 3.9, color: '#EF4444' }
  ];

  const trendData = [
    { month: 'Jan', sei: 3.8, responses: 1200 },
    { month: 'Feb', sei: 4.0, responses: 1350 },
    { month: 'Mar', sei: 4.2, responses: 1400 },
    { month: 'Apr', sei: 4.1, responses: 1320 },
    { month: 'May', sei: 4.3, responses: 1450 },
    { month: 'Jun', sei: 4.4, responses: 1500 }
  ];

  const departmentData = [
    { name: 'Computer Science', sei: 4.2, sessions: 15 },
    { name: 'Mathematics', sei: 4.0, sessions: 12 },
    { name: 'Physics', sei: 3.9, sessions: 10 },
    { name: 'Chemistry', sei: 4.1, sessions: 8 },
    { name: 'Electrical Eng.', sei: 4.3, sessions: 14 }
  ];

  const topPerformingSessions = sessions?.slice(0, 10).map((session, index) => ({
    key: session.id,
    rank: index + 1,
    course: `${session.courseCode} - ${session.courseName}`,
    instructor: session.instructorName,
    sei: (Math.random() * 1.5 + 3.5).toFixed(2),
    responses: Math.floor(Math.random() * 50) + 120,
    department: session.department
  }));

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => (
        <div className="flex items-center justify-center">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {rank}
          </span>
        </div>
      )
    },
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
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag color="blue">{dept}</Tag>
    },
    {
      title: 'SEI',
      dataIndex: 'sei',
      key: 'sei',
      sorter: (a: any, b: any) => parseFloat(a.sei) - parseFloat(b.sei),
      render: (sei: string) => (
        <span className="font-bold text-green-600">{sei}</span>
      )
    },
    {
      title: 'Responses',
      dataIndex: 'responses',
      key: 'responses',
    }
  ];

  const handleExport = () => {
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Analytics & Reports
          </h1>
          <p className="text-gray-600">Comprehensive teaching evaluation analytics</p>
        </div>
        <Button
          type="primary"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExport}
          className="bg-primary-500 hover:bg-primary-600"
        >
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card title={<span className="flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</span>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <Select
              value={filters.department}
              onChange={(value) => setFilters({...filters, department: value})}
              className="w-full"
            >
              <Option value="all">All Departments</Option>
              <Option value="Computer Science">Computer Science</Option>
              <Option value="Mathematics">Mathematics</Option>
              <Option value="Physics">Physics</Option>
              <Option value="Chemistry">Chemistry</Option>
              <Option value="Electrical Engineering">Electrical Engineering</Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => setFilters({...filters, dateRange: dates})}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Instructor</label>
            <Select
              value={filters.instructor}
              onChange={(value) => setFilters({...filters, instructor: value})}
              className="w-full"
            >
              <Option value="all">All Instructors</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary-500">{analytics?.averageSEI?.toFixed(2) || '0.00'}</div>
            <div className="text-sm text-gray-600">Average SEI</div>
            <div className="text-xs text-green-500 mt-1">↑ 5.2% from last month</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-teal-500">{analytics?.totalSessions || 0}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
            <div className="text-xs text-blue-500 mt-1">12 this week</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-500">{analytics?.totalFeedback || 0}</div>
            <div className="text-sm text-gray-600">Total Feedback</div>
            <div className="text-xs text-purple-500 mt-1">1,234 this month</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-500">{((analytics?.responseRate || 0) * 100).toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
            <div className="text-xs text-green-500 mt-1">↑ 3.1% from last month</div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="SEI Trend Over Time">
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
        <Col xs={24} lg={8}>
          <Card title="Dimension Scores">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dimensionScores} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="dimension" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="score" fill="#14B8A6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Department Performance">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sei" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Response Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Excellent (5)', value: 45, fill: '#10B981' },
                    { name: 'Good (4)', value: 30, fill: '#3B82F6' },
                    { name: 'Average (3)', value: 15, fill: '#F59E0B' },
                    { name: 'Poor (2)', value: 7, fill: '#EF4444' },
                    { name: 'Very Poor (1)', value: 3, fill: '#6B7280' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Performing Sessions */}
      <Card title="Top Performing Sessions">
        <Table
          columns={columns}
          dataSource={topPerformingSessions}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default AnalyticsPage;
