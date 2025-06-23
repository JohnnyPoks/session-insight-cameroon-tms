
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

// Simple interface definitions to avoid TypeScript compiler issues
interface User {
  id: string;
  username: string;
  role: 'dean' | 'hod' | 'student';
  department?: string;
  name: string;
}

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
}

interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
}

interface Student {
  id: string;
  matriculationNumber: string;
  name: string;
  email: string;
  level: string;
  coursesRegistered: string[];
}

interface Session {
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

interface FeedbackScores {
  'Clarity & Organization': number;
  'Student Engagement': number;
  'Pedagogical Methods & Activities': number;
  'Content Delivery & Subject Mastery': number;
  'Perceived Learning Impact': number;
}

interface Feedback {
  id: string;
  sessionId: string;
  studentId: string;
  submissionTimestamp: string;
  scores: FeedbackScores;
  openEndedComment: string;
}

interface Question {
  id: string;
  dimension: string;
  text: string;
  type: 'likert' | 'open_ended';
}

interface Questionnaire {
  id: string;
  name: string;
  questions: Question[];
}

interface SessionAnalytics {
  sessionId: string;
  averageScores: FeedbackScores;
  sei: number;
  responseCount: number;
  responseRate: number;
}

interface OverviewAnalytics {
  averageSEI: number;
  totalSessions: number;
  totalFeedback: number;
  responseRate: number;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Course', 'Lecturer', 'Student', 'Session', 'Feedback', 'Analytics', 'Questionnaire'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Courses
    getCourses: builder.query<Course[], void>({
      query: () => '/courses',
      providesTags: ['Course'],
    }),
    createCourse: builder.mutation({
      query: (course: Partial<Course>) => ({
        url: '/courses',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<Course> }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),
    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),

    // Lecturers
    getLecturers: builder.query<Lecturer[], void>({
      query: () => '/lecturers',
      providesTags: ['Lecturer'],
    }),
    createLecturer: builder.mutation({
      query: (lecturer: Partial<Lecturer>) => ({
        url: '/lecturers',
        method: 'POST',
        body: lecturer,
      }),
      invalidatesTags: ['Lecturer'],
    }),
    updateLecturer: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<Lecturer> }) => ({
        url: `/lecturers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Lecturer'],
    }),
    deleteLecturer: builder.mutation({
      query: (id: string) => ({
        url: `/lecturers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecturer'],
    }),

    // Students
    getStudents: builder.query<Student[], void>({
      query: () => '/students',
      providesTags: ['Student'],
    }),
    uploadStudentList: builder.mutation({
      query: ({ courseId, file }: { courseId: string; file: File }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseId', courseId);
        return {
          url: '/students/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Student'],
    }),

    // Sessions
    getSessions: builder.query<Session[], void>({
      query: () => '/sessions',
      providesTags: ['Session'],
    }),
    getSession: builder.query<Session, string>({
      query: (id) => `/sessions/${id}`,
      providesTags: ['Session'],
    }),
    createSession: builder.mutation({
      query: (session: Partial<Session>) => ({
        url: '/sessions',
        method: 'POST',
        body: session,
      }),
      invalidatesTags: ['Session'],
    }),
    updateSession: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<Session> }) => ({
        url: `/sessions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Session'],
    }),
    deleteSession: builder.mutation({
      query: (id: string) => ({
        url: `/sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Session'],
    }),

    // Feedback
    submitFeedback: builder.mutation({
      query: (feedback: Partial<Feedback>) => ({
        url: '/feedback/submit',
        method: 'POST',
        body: feedback,
      }),
      invalidatesTags: ['Feedback', 'Analytics'],
    }),
    verifyStudent: builder.mutation({
      query: ({ sessionId, matriculationNumber }: { sessionId: string; matriculationNumber: string }) => ({
        url: '/feedback/verify-student',
        method: 'POST',
        body: { sessionId, matriculationNumber },
      }),
    }),

    // Questionnaires
    getQuestionnaires: builder.query<Questionnaire[], void>({
      query: () => '/questionnaires',
      providesTags: ['Questionnaire'],
    }),
    createQuestionnaire: builder.mutation({
      query: (questionnaire: Partial<Questionnaire>) => ({
        url: '/questionnaires',
        method: 'POST',
        body: questionnaire,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    updateQuestionnaire: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<Questionnaire> }) => ({
        url: `/questionnaires/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    deleteQuestionnaire: builder.mutation({
      query: (id: string) => ({
        url: `/questionnaires/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questionnaire'],
    }),

    // Analytics
    getOverviewAnalytics: builder.query<OverviewAnalytics, void>({
      query: () => '/analytics/overview',
      providesTags: ['Analytics'],
    }),
    getSessionAnalytics: builder.query<SessionAnalytics, string>({
      query: (sessionId) => `/analytics/session/${sessionId}`,
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetLecturersQuery,
  useCreateLecturerMutation,
  useUpdateLecturerMutation,
  useDeleteLecturerMutation,
  useGetStudentsQuery,
  useUploadStudentListMutation,
  useGetSessionsQuery,
  useGetSessionQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useSubmitFeedbackMutation,
  useVerifyStudentMutation,
  useGetQuestionnairesQuery,
  useCreateQuestionnaireMutation,
  useUpdateQuestionnaireMutation,
  useDeleteQuestionnaireMutation,
  useGetOverviewAnalyticsQuery,
  useGetSessionAnalyticsQuery,
} = apiSlice;
