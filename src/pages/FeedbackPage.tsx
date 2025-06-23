
import React, { useState } from 'react';
import { Card, Form, Rate, Input, Button, Typography, message, Spin, Steps } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Send, User, CheckCircle } from 'lucide-react';
import { useGetSessionQuery, useSubmitFeedbackMutation, useVerifyStudentMutation } from '../api/apiSlice';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

interface FeedbackScores {
  'Clarity & Organization': number;
  'Student Engagement': number;
  'Pedagogical Methods & Activities': number;
  'Content Delivery & Subject Mastery': number;
  'Perceived Learning Impact': number;
}

const FeedbackPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [verificationForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [verifiedStudent, setVerifiedStudent] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const { data: session, isLoading } = useGetSessionQuery(sessionId!);
  const [verifyStudent, { isLoading: verifying }] = useVerifyStudentMutation();
  const [submitFeedback, { isLoading: submitting }] = useSubmitFeedbackMutation();

  const dimensions = [
    {
      key: 'Clarity & Organization' as keyof FeedbackScores,
      label: 'Clarity & Organization',
      description: 'How clear and well-organized was the session content?'
    },
    {
      key: 'Student Engagement' as keyof FeedbackScores,
      label: 'Student Engagement',
      description: 'How well did the instructor engage students in learning?'
    },
    {
      key: 'Pedagogical Methods & Activities' as keyof FeedbackScores,
      label: 'Pedagogical Methods & Activities',
      description: 'How effective were the teaching methods and activities used?'
    },
    {
      key: 'Content Delivery & Subject Mastery' as keyof FeedbackScores,
      label: 'Content Delivery & Subject Mastery',
      description: 'How well did the instructor demonstrate subject mastery and deliver content?'
    },
    {
      key: 'Perceived Learning Impact' as keyof FeedbackScores,
      label: 'Perceived Learning Impact',
      description: 'How much do you feel you learned from this session?'
    }
  ];

  const handleVerification = async (values: any) => {
    try {
      const result = await verifyStudent({
        sessionId: sessionId!,
        matriculationNumber: values.matriculationNumber
      }).unwrap();

      setVerifiedStudent(result.student);
      setCurrentStep(1);
      message.success('Student verified successfully!');
    } catch (error) {
      message.error('Student verification failed. Please check your matriculation number.');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const scores: FeedbackScores = {
        'Clarity & Organization': values['Clarity & Organization'] || 3,
        'Student Engagement': values['Student Engagement'] || 3,
        'Pedagogical Methods & Activities': values['Pedagogical Methods & Activities'] || 3,
        'Content Delivery & Subject Mastery': values['Content Delivery & Subject Mastery'] || 3,
        'Perceived Learning Impact': values['Perceived Learning Impact'] || 3
      };

      await submitFeedback({
        sessionId: sessionId!,
        scores,
        openEndedComment: values.comment || '',
        studentId: verifiedStudent.id
      }).unwrap();

      setSubmitted(true);
      message.success('Thank you for your feedback!');
    } catch (error) {
      message.error('Failed to submit feedback. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <Title level={3} className="text-green-600">Feedback Submitted!</Title>
            <Text className="text-gray-600">
              Thank you for your valuable feedback. Your input helps improve teaching quality.
            </Text>
          </div>
          <Button 
            type="primary" 
            onClick={() => navigate('/')}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <Title level={2}>Session Evaluation</Title>
          <Text className="text-gray-600">Your feedback helps improve teaching quality</Text>
        </div>

        {session && (
          <Card className="mb-6 shadow-lg">
            <div className="text-center">
              <Title level={3} className="mb-2">{session.courseCode} - {session.courseName}</Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Instructor:</strong> {session.instructorName}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(session.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {session.time}
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="shadow-lg">
          <Steps current={currentStep} className="mb-8">
            <Step title="Student Verification" icon={<User className="w-4 h-4" />} />
            <Step title="Session Evaluation" icon={<FileText className="w-4 h-4" />} />
          </Steps>

          {currentStep === 0 && (
            <div>
              <Title level={4} className="mb-4">Student Verification</Title>
              <Text className="text-gray-600 mb-6 block">
                Please enter your matriculation number to verify your enrollment in this course.
              </Text>
              
              <Form
                form={verificationForm}
                layout="vertical"
                onFinish={handleVerification}
              >
                <Form.Item
                  name="matriculationNumber"
                  label="Matriculation Number"
                  rules={[{ required: true, message: 'Please enter your matriculation number' }]}
                >
                  <Input 
                    placeholder="e.g., STU2024001" 
                    size="large"
                    className="text-center"
                  />
                </Form.Item>

                <div className="text-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={verifying}
                    className="bg-primary-500 hover:bg-primary-600 px-8"
                  >
                    Verify Student
                  </Button>
                </div>
              </Form>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              {verifiedStudent && (
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Verified: {verifiedStudent.name} ({verifiedStudent.matriculationNumber})
                    </span>
                  </div>
                </div>
              )}

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div className="space-y-8">
                  <div>
                    <Title level={4} className="mb-6">Please rate the following aspects (1 = Poor, 5 = Excellent)</Title>
                    
                    {dimensions.map((dimension, index) => (
                      <div key={dimension.key} className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <div className="mb-3">
                          <Text strong className="block mb-1">{dimension.label}</Text>
                          <Text className="text-sm text-gray-600">{dimension.description}</Text>
                        </div>
                        <Form.Item
                          name={dimension.key}
                          initialValue={3}
                          rules={[{ required: true, message: `Please rate ${dimension.label}` }]}
                        >
                          <Rate 
                            count={5}
                            className="text-xl"
                            character="★"
                          />
                        </Form.Item>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Title level={4} className="mb-4">Additional Comments</Title>
                    <Form.Item name="comment">
                      <TextArea
                        rows={4}
                        placeholder="Please share any additional thoughts or suggestions to help improve future sessions..."
                        className="resize-none"
                      />
                    </Form.Item>
                  </div>

                  <div className="text-center pt-6">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={submitting}
                      icon={<Send className="w-4 h-4" />}
                      className="bg-primary-500 hover:bg-primary-600 h-12 px-8"
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Card>

        <div className="text-center mt-6">
          <Text className="text-sm text-gray-500">
            Your feedback is linked to your student record but will be anonymized in reports to instructors.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
