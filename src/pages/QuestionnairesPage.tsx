
import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tag } from 'antd';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useGetQuestionnairesQuery, useCreateQuestionnaireMutation, useUpdateQuestionnaireMutation, useDeleteQuestionnaireMutation } from '../api/apiSlice';
import type { Questionnaire, Question, FeedbackScores } from '../types';

const { Option } = Select;
const { TextArea } = Input;

const QuestionnairesPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);
  const [previewQuestionnaire, setPreviewQuestionnaire] = useState<Questionnaire | null>(null);
  const [form] = Form.useForm();

  const { data: questionnaires, isLoading } = useGetQuestionnairesQuery();
  const [createQuestionnaire] = useCreateQuestionnaireMutation();
  const [updateQuestionnaire] = useUpdateQuestionnaireMutation();
  const [deleteQuestionnaire] = useDeleteQuestionnaireMutation();

  const dimensions = [
    'Clarity & Organization',
    'Student Engagement',
    'Pedagogical Methods & Activities',
    'Content Delivery & Subject Mastery',
    'Perceived Learning Impact'
  ];

  const defaultQuestions: Question[] = [
    {
      id: '1',
      dimension: 'Clarity & Organization',
      text: 'How clear and well-organized was the session content?',
      type: 'likert'
    },
    {
      id: '2',
      dimension: 'Student Engagement',
      text: 'How well did the instructor engage students in learning?',
      type: 'likert'
    },
    {
      id: '3',
      dimension: 'Pedagogical Methods & Activities',
      text: 'How effective were the teaching methods and activities used?',
      type: 'likert'
    },
    {
      id: '4',
      dimension: 'Content Delivery & Subject Mastery',
      text: 'How well did the instructor demonstrate subject mastery?',
      type: 'likert'
    },
    {
      id: '5',
      dimension: 'Perceived Learning Impact',
      text: 'How much do you feel you learned from this session?',
      type: 'likert'
    },
    {
      id: '6',
      dimension: 'Clarity & Organization',
      text: 'Please provide any additional comments or suggestions.',
      type: 'open_ended'
    }
  ];

  const handleCreate = () => {
    setEditingQuestionnaire(null);
    form.resetFields();
    form.setFieldsValue({ 
      name: 'New Questionnaire',
      questions: defaultQuestions 
    });
    setIsModalVisible(true);
  };

  const handleEdit = (questionnaire: Questionnaire) => {
    setEditingQuestionnaire(questionnaire);
    form.setFieldsValue(questionnaire);
    setIsModalVisible(true);
  };

  const handlePreview = (questionnaire: Questionnaire) => {
    setPreviewQuestionnaire(questionnaire);
    setIsPreviewVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestionnaire(id).unwrap();
      message.success('Questionnaire deleted successfully');
    } catch (error) {
      message.error('Failed to delete questionnaire');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const questionnaireData = {
        ...values,
        questions: values.questions || defaultQuestions
      };

      if (editingQuestionnaire) {
        await updateQuestionnaire({ 
          id: editingQuestionnaire.id, 
          data: questionnaireData 
        }).unwrap();
        message.success('Questionnaire updated successfully');
      } else {
        await createQuestionnaire(questionnaireData).unwrap();
        message.success('Questionnaire created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save questionnaire');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Questionnaire, b: Questionnaire) => a.name.localeCompare(b.name),
    },
    {
      title: 'Questions',
      key: 'questionsCount',
      render: (questionnaire: Questionnaire) => (
        <Tag color="blue">{questionnaire.questions?.length || 0} questions</Tag>
      ),
    },
    {
      title: 'Dimensions Covered',
      key: 'dimensions',
      render: (questionnaire: Questionnaire) => {
        const uniqueDimensions = [...new Set(questionnaire.questions?.map(q => q.dimension) || [])];
        return (
          <div className="flex flex-wrap gap-1">
            {uniqueDimensions.slice(0, 2).map(dim => (
              <Tag key={dim} color="green" className="text-xs">{dim}</Tag>
            ))}
            {uniqueDimensions.length > 2 && (
              <Tag color="gray" className="text-xs">+{uniqueDimensions.length - 2} more</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (questionnaire: Questionnaire) => (
        <Space>
          <Button
            size="small"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => handlePreview(questionnaire)}
          >
            Preview
          </Button>
          <Button
            size="small"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEdit(questionnaire)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this questionnaire?"
            onConfirm={() => handleDelete(questionnaire.id)}
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
            <FileText className="w-6 h-6" />
            Questionnaire Management
          </h1>
          <p className="text-gray-600">Design and manage evaluation questionnaires</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
          className="bg-primary-500 hover:bg-primary-600"
        >
          Create Questionnaire
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={questionnaires}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingQuestionnaire ? 'Edit Questionnaire' : 'Create Questionnaire'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Questionnaire Name"
            rules={[{ required: true, message: 'Please enter questionnaire name' }]}
          >
            <Input placeholder="Enter questionnaire name" />
          </Form.Item>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Questions Preview</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {defaultQuestions.map((question, index) => (
                <Card key={question.id} size="small" className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color="blue">Q{index + 1}</Tag>
                        <Tag color={question.type === 'likert' ? 'green' : 'orange'}>
                          {question.type === 'likert' ? 'Likert Scale' : 'Open Ended'}
                        </Tag>
                        <Tag color="purple" className="text-xs">{question.dimension}</Tag>
                      </div>
                      <p className="text-sm">{question.text}</p>
                      {question.type === 'likert' && (
                        <div className="mt-2 text-xs text-gray-500">
                          Scale: 1 (Very Poor) - 5 (Excellent)
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="bg-primary-500 hover:bg-primary-600"
            >
              {editingQuestionnaire ? 'Update' : 'Create'} Questionnaire
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Questionnaire Preview"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {previewQuestionnaire && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">{previewQuestionnaire.name}</h2>
              <p className="text-gray-600">Session Evaluation Form</p>
            </div>
            
            {(previewQuestionnaire.questions || defaultQuestions).map((question, index) => (
              <div key={question.id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Q{index + 1}.</span>
                  <Tag color="purple" className="text-xs">{question.dimension}</Tag>
                </div>
                <p className="mb-3">{question.text}</p>
                
                {question.type === 'likert' ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Very Poor</span>
                    {[1, 2, 3, 4, 5].map(num => (
                      <div key={num} className="flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center text-sm">
                          {num}
                        </div>
                      </div>
                    ))}
                    <span className="text-sm text-gray-500">Excellent</span>
                  </div>
                ) : (
                  <TextArea 
                    rows={3} 
                    placeholder="Please provide your comments here..." 
                    disabled 
                    className="bg-gray-50"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuestionnairesPage;
