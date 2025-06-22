
import React from 'react';
import { Card, Row, Col, Statistic, Typography, Progress, Table, Tag } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Calendar, FileText } from 'lucide-react';
import { useGetOverviewAnalyticsQuery, useGetSessionsQuery } from '../api/apiSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: analytics, isLoading: analyticsLoading } = useGetOverviewAnalyticsQuery();
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionsQuery();

  // Mock trend data
  const trendData = [
    { month: 'Jan', sei: 3.8, responses: 1200 },
    { month: 'Feb', sei: 4.0, responses: 1350 },
    { month: 'Mar', sei: 4.2, responses: 1400 },
    { month: 'Apr', sei: 4.1, responses: 1320 },
    { month: 'May', sei: 4.3, responses: 1450 },
    { month: 'Jun', sei: 4.4, responses: 1500 }
  ];

  const recentSessions = sessions?.slice(0, 5).map(session => ({
    key: session.id,
    course: `${session.courseCode} - ${session.courseName}`,
    instructor: session.instructorName,
    date: new Date(session.date).toLocaleDateString(),
    status: session.status,
    students: session.studentCount
  }));

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
            Here's your teaching evaluation overview
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
              title="Total Sessions"
              value={analytics?.totalSessions || 0}
              valueStyle={{ color: '#1E40AF' }}
              prefix={<Calendar className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Feedback"
              value={analytics?.totalFeedback || 0}
              valueStyle={{ color: '#7C3AED' }}
              prefix={<FileText className="w-4 h-4" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Response Rate"
              value={(analytics?.responseRate || 0) * 100}
              precision={1}
              valueStyle={{ color: '#059669' }}
              prefix={<Users className="w-4 h-4" />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
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
        <Col xs={24} lg={8}>
          <Card title="Monthly Responses" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
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

      {/* Recent Sessions */}
      <Card title="Recent Sessions" loading={sessionsLoading}>
        <Table
          columns={statusColumns}
          dataSource={recentSessions}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
