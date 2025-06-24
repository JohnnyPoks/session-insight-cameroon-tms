
import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Descriptions, Row, Col, Statistic, Typography } from 'antd';
import { ArrowLeft, Users, Calendar, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetSessionQuery, useGetSessionAnalyticsQuery } from '../../api/apiSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const SessionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);

  const { data: session, isLoading: sessionLoading } = useGetSessionQuery(sessionId || '');
  const { data: analytics, isLoading: analyticsLoading } = useGetSessionAnalyticsQuery(sessionId || '');

  // Mock feedback responses
  const feedbackResponses = [
    {
      id: '1',
      responseId: 'Response 1',
      submissionTime: '2024-06-24 10:30:00',
      scores: {
        'Clarity & Organization': 4,
        'Student Engagement': 5,
        'Pedagogical Methods & Activities': 4,
        'Content Delivery & Subject Mastery': 5,
        'Perceived Learning Impact': 4
      },
      comment: 'Great session! The instructor explained concepts clearly and engaged students well.'
    },
    {
      id: '2',
      responseId: 'Response 2',
      submissionTime: '2024-06-24 10:35:00',
      scores: {
        'Clarity & Organization': 3,
        'Student Engagement': 4,
        'Pedagogical Methods & Activities': 3,
        'Content Delivery & Subject Mastery': 4,
        'Perceived Learning Impact': 3
      },
      comment: 'Good session overall, but could use more interactive activities.'
    }
  ];

  // Ensure dimension data has valid numeric values
  const dimensionData = analytics?.averageScores ? 
    Object.entries(analytics.averageScores).map(([key, value]) => ({
      dimension: key,
      score: Number(value) || 0
    })) : [];

  const handleViewResponse = (response: any) => {
    setSelectedResponse(response);
    setIsResponseModalVisible(true);
  };

  const responseColumns = [
    {
      title: 'Response ID',
      dataIndex: 'responseId',
      key: 'responseId',
    },
    {
      title: 'Submission Time',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button
          type="link"
          onClick={() => handleViewResponse(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (sessionLoading || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/sessions')}
          >
            Back to Sessions
          </Button>
          <div>
            <Title level={2} className="mb-0">
              Session Details
            </Title>
            <Text className="text-gray-600">
              {session.courseCode || ''} - {session.courseName || ''}
            </Text>
          </div>
        </div>
        <Space>
          {session.status === 'open_for_feedback' && (
            <Button type="primary">
              Manually Close Feedback
            </Button>
          )}
          {session.status === 'closed' && (
            <Button>
              Re-open Feedback
            </Button>
          )}
        </Space>
      </div>

      {/* Session Information */}
      <Card title="Session Information">
        <Descriptions column={3} bordered>
          <Descriptions.Item label="Course Code">{session.courseCode || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Course Name">{session.courseName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Instructor">{session.instructorName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Date">
            {session.date ? new Date(session.date).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Time">{session.time || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Department">{session.department || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Expected Students">{Number(session.studentCount) || 0}</Descriptions.Item>
          <Descriptions.Item label="Responses Received">{Number(analytics?.responseCount) || 0}</Descriptions.Item>
          <Descriptions.Item label="Response Rate">
            <Tag color="green">{((Number(analytics?.responseRate) || 0) * 100).toFixed(1)}%</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Statistic
              title="Session SEI"
              value={Number(analytics?.sei) || 0}
              precision={2}
              valueStyle={{ color: '#14B8A6', fontSize: '2rem' }}
              suffix="/ 5.0"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Statistic
              title="Total Responses"
              value={Number(analytics?.responseCount) || 0}
              valueStyle={{ color: '#1E40AF', fontSize: '2rem' }}
              prefix={<FileText className="w-6 h-6" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Statistic
              title="Response Rate"
              value={(Number(analytics?.responseRate) || 0) * 100}
              precision={1}
              valueStyle={{ color: '#059669', fontSize: '2rem' }}
              suffix="%"
              prefix={<Users className="w-6 h-6" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Dimension Scores Chart */}
      <Card title="Dimension Scores">
        {dimensionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dimensionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="dimension" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="score" fill="#14B8A6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-500">No data available</div>
        )}
      </Card>

      {/* Individual Feedback Responses */}
      <Card title="Individual Feedback Responses (Anonymized)">
        <Table
          columns={responseColumns}
          dataSource={feedbackResponses}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
        />
      </Card>

      {/* Response Detail Modal */}
      <Modal
        title="Response Details"
        open={isResponseModalVisible}
        onCancel={() => setIsResponseModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsResponseModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedResponse && (
          <div className="space-y-4">
            <div>
              <Text strong>Response ID: </Text>
              <Text>{selectedResponse.responseId}</Text>
            </div>
            <div>
              <Text strong>Submission Time: </Text>
              <Text>{new Date(selectedResponse.submissionTime).toLocaleString()}</Text>
            </div>
            
            <div>
              <Text strong className="text-lg">Dimension Scores:</Text>
              <div className="mt-2 space-y-2">
                {Object.entries(selectedResponse.scores || {}).map(([dimension, score]) => (
                  <div key={dimension} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{dimension}</span>
                    <Tag color="blue">{Number(score) || 0}/5</Tag>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Text strong className="text-lg">Comments:</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <Text>{selectedResponse.comment || 'No comment provided'}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SessionDetails;
