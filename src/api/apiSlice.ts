
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import type { User, Course, Lecturer, Session, Feedback, SessionAnalytics, Questionnaire } from '../types';

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
  tagTypes: ['User', 'Course', 'Lecturer', 'Session', 'Feedback', 'Analytics', 'Questionnaire'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<{ user: User; token: string }, { username: string; password: string }>({
      query: (credentials) => ({
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
    createCourse: builder.mutation<Course, Partial<Course>>({
      query: (course) => ({
        url: '/courses',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation<Course, { id: string; data: Partial<Course> }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),
    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
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
    createLecturer: builder.mutation<Lecturer, Partial<Lecturer>>({
      query: (lecturer) => ({
        url: '/lecturers',
        method: 'POST',
        body: lecturer,
      }),
      invalidatesTags: ['Lecturer'],
    }),
    updateLecturer: builder.mutation<Lecturer, { id: string; data: Partial<Lecturer> }>({
      query: ({ id, data }) => ({
        url: `/lecturers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Lecturer'],
    }),
    deleteLecturer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/lecturers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecturer'],
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
    createSession: builder.mutation<Session, Partial<Session>>({
      query: (session) => ({
        url: '/sessions',
        method: 'POST',
        body: session,
      }),
      invalidatesTags: ['Session'],
    }),
    updateSession: builder.mutation<Session, { id: string; data: Partial<Session> }>({
      query: ({ id, data }) => ({
        url: `/sessions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Session'],
    }),
    deleteSession: builder.mutation<void, string>({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Session'],
    }),

    // Feedback
    submitFeedback: builder.mutation<Feedback, Partial<Feedback>>({
      query: (feedback) => ({
        url: '/feedback/submit',
        method: 'POST',
        body: feedback,
      }),
      invalidatesTags: ['Feedback', 'Analytics'],
    }),

    // Questionnaires
    getQuestionnaires: builder.query<Questionnaire[], void>({
      query: () => '/questionnaires',
      providesTags: ['Questionnaire'],
    }),
    createQuestionnaire: builder.mutation<Questionnaire, Partial<Questionnaire>>({
      query: (questionnaire) => ({
        url: '/questionnaires',
        method: 'POST',
        body: questionnaire,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    updateQuestionnaire: builder.mutation<Questionnaire, { id: string; data: Partial<Questionnaire> }>({
      query: ({ id, data }) => ({
        url: `/questionnaires/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    deleteQuestionnaire: builder.mutation<void, string>({
      query: (id) => ({
        url: `/questionnaires/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questionnaire'],
    }),

    // Analytics
    getOverviewAnalytics: builder.query<{
      averageSEI: number;
      totalSessions: number;
      totalFeedback: number;
      responseRate: number;
    }, void>({
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
  useGetSessionsQuery,
  useGetSessionQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useSubmitFeedbackMutation,
  useGetQuestionnairesQuery,
  useCreateQuestionnaireMutation,
  useUpdateQuestionnaireMutation,
  useDeleteQuestionnaireMutation,
  useGetOverviewAnalyticsQuery,
  useGetSessionAnalyticsQuery,
} = apiSlice;
