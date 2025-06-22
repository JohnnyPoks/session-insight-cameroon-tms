
export interface User {
  id: string;
  username: string;
  role: 'dean' | 'hod' | 'student';
  department?: string;
  name: string;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
}

export interface Session {
  id: string;
  courseCode: string;
  courseName: string;
  instructorName: string;
  department: string;
  date: string;
  time: string;
  studentCount: number;
  status: 'scheduled' | 'open_for_feedback' | 'closed';
  questionnaireId: string;
  evaluationStart?: string;
  evaluationEnd?: string;
}

export interface FeedbackScores {
  'Clarity & Organization': number;
  'Student Engagement': number;
  'Pedagogical Methods & Activities': number;
  'Content Delivery & Subject Mastery': number;
  'Perceived Learning Impact': number;
}

export interface Feedback {
  id: string;
  sessionId: string;
  studentId: string;
  submissionTimestamp: string;
  scores: FeedbackScores;
  openEndedComment: string;
}

export interface SEIWeights {
  'Clarity & Organization': number;
  'Student Engagement': number;
  'Pedagogical Methods & Activities': number;
  'Content Delivery & Subject Mastery': number;
  'Perceived Learning Impact': number;
}

export interface SessionAnalytics {
  sessionId: string;
  averageScores: FeedbackScores;
  sei: number;
  responseCount: number;
  responseRate: number;
}

export interface Question {
  id: string;
  dimension: keyof FeedbackScores;
  text: string;
  type: 'likert' | 'open_ended';
}

export interface Questionnaire {
  id: string;
  name: string;
  questions: Question[];
}
