
import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tag, Descriptions } from 'antd';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useGetQuestionnairesQuery, useCreateQuestionnaireMutation, useUpdateQuestionnaireMutation, useDeleteQuestionnaireMutation } from '../api/apiSlice';

const { Option } = Select;
const { TextArea } = Input;

interface Question {
  id: string;
  text: string;
  type: 'likert' | 'open_ended';
  dimension: string;
  required: boolean;
}

interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active';
  questions: Question[];
  lastUpdated?: string;
}

const QuestionnairesPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);
  const [previewQuestionnaire, setPreviewQuestionnaire] = useState<Questionnaire | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  
  const [form] = Form.useForm();
  const [questionForm] = Form.useForm();

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

  const questionTypes = [
    { value: 'likert', label: '5-Point Scale (Likert)' },
    { value: 'open_ended', label: 'Open Text' }
  ];

  const handleCreate = () => {
    setEditingQuestionnaire(null);
    setCurrentQuestions([]);
    form.resetFields();
    form.setFieldsValue({ 
      name: '',
      description: '',
      status: 'draft'
    });
    setIsModalVisible(true);
  };

  const handleEdit = (questionnaire: Questionnaire) => {
    setEditingQuestionnaire(questionnaire);
    setCurrentQuestions(questionnaire.questions || []);
    form.setFieldsValue({
      name: questionnaire.name,
      description: questionnaire.description,
      status: questionnaire.status
    });
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
        questions: currentQuestions,
        lastUpdated: new Date().toISOString()
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
      setCurrentQuestions([]);
    } catch (error) {
      message.error('Failed to save questionnaire');
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    questionForm.resetFields();
    questionForm.setFieldsValue({
      type: 'likert',
      required: true
    });
    setIsQuestionModalVisible(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    questionForm.setFieldsValue(question);
    setIsQuestionModalVisible(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setCurrentQuestions(prev => prev.filter(q => q.id !== questionId));
    message.success('Question removed from template');
  };

  const handleSaveQuestion = (values: any) => {
    const questionData = {
      ...values,
      id: editingQuestion?.id || Date.now().toString()
    };

    if (editingQuestion) {
      setCurrentQuestions(prev => 
        prev.map(q => q.id === editingQuestion.id ? questionData : q)
      );
      message.success('Question updated');
    } else {
      setCurrentQuestions(prev => [...prev, questionData]);
      message.success('Question added to template');
    }

    setIsQuestionModalVisible(false);
    questionForm.resetFields();
  };

  const columns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Questionnaire, b: Questionnaire) => a.name.localeCompare(b.name),
    },
    {
      title: 'No. of Questions',
      key: 'questionsCount',
      render: (questionnaire: Questionnaire) => (
        <Tag color="blue">{questionnaire.questions?.length || 0}</Tag>
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
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
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
          Create Questionnaire Template
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

      {/* Create/Edit Questionnaire Modal */}
      <Modal
        title={editingQuestionnaire ? 'Edit Questionnaire Template' : 'Create Questionnaire Template'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Template Title"
              rules={[{ required: true, message: 'Please enter template title' }]}
            >
              <Input placeholder="Enter template title" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Option value="draft">Draft</Option>
                <Option value="active">Active</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Template Description"
          >
            <TextArea rows={3} placeholder="Enter template description" />
          </Form.Item>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Questions Configuration</h3>
              <Button 
                type="dashed" 
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {currentQuestions.map((question, index) => (
                <Card key={question.id} size="small" className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color="blue">Q{index + 1}</Tag>
                        <Tag color={question.type === 'likert' ? 'green' : 'orange'}>
                          {question.type === 'likert' ? 'Likert Scale' : 'Open Text'}
                        </Tag>
                        <Tag color="purple" className="text-xs">{question.dimension}</Tag>
                        {question.required && <Tag color="red" className="text-xs">Required</Tag>}
                      </div>
                      <p className="text-sm mb-2">{question.text}</p>
                    </div>
                    <Space>
                      <Button
                        size="small"
                        icon={<Edit className="w-3 h-3" />}
                        onClick={() => handleEditQuestion(question)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<Trash2 className="w-3 h-3" />}
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        Delete
                      </Button>
                    </Space>
                  </div>
                </Card>
              ))}
              
              {currentQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded">
                  No questions added yet. Click "Add Question" to get started.
                </div>
              )}
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
              {editingQuestionnaire ? 'Update' : 'Create'} Template
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add/Edit Question Modal */}
      <Modal
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        open={isQuestionModalVisible}
        onCancel={() => setIsQuestionModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={questionForm}
          layout="vertical"
          onFinish={handleSaveQuestion}
          className="mt-4"
        >
          <Form.Item
            name="text"
            label="Question Text"
            rules={[{ required: true, message: 'Please enter question text' }]}
          >
            <TextArea rows={3} placeholder="Enter the question text" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Question Type"
              rules={[{ required: true, message: 'Please select question type' }]}
            >
              <Select placeholder="Select question type">
                {questionTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dimension"
              label="Evaluation Dimension"
              rules={[{ required: true, message: 'Please select dimension' }]}
            >
              <Select placeholder="Select dimension">
                {dimensions.map(dim => (
                  <Option key={dim} value={dim}>{dim}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="required"
            valuePropName="checked"
          >
            <input type="checkbox" className="mr-2" />
            This question is required
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsQuestionModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="bg-primary-500 hover:bg-primary-600"
            >
              {editingQuestion ? 'Update' : 'Add'} Question
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
              {previewQuestionnaire.description && (
                <p className="text-gray-600">{previewQuestionnaire.description}</p>
              )}
            </div>
            
            {(previewQuestionnaire.questions || []).map((question, index) => (
              <div key={question.id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Q{index + 1}.</span>
                  <Tag color="purple" className="text-xs">{question.dimension}</Tag>
                  {question.required && <Tag color="red" className="text-xs">Required</Tag>}
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

            {(!previewQuestionnaire.questions || previewQuestionnaire.questions.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No questions configured for this template.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuestionnairesPage;
