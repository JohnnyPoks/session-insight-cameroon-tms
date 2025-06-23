
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

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
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Courses
    getCourses: builder.query<any[], void>({
      query: () => '/courses',
      providesTags: ['Course'],
    }),
    createCourse: builder.mutation<any, any>({
      query: (course) => ({
        url: '/courses',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),
    deleteCourse: builder.mutation<any, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),

    // Lecturers
    getLecturers: builder.query<any[], void>({
      query: () => '/lecturers',
      providesTags: ['Lecturer'],
    }),
    createLecturer: builder.mutation<any, any>({
      query: (lecturer) => ({
        url: '/lecturers',
        method: 'POST',
        body: lecturer,
      }),
      invalidatesTags: ['Lecturer'],
    }),
    updateLecturer: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/lecturers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Lecturer'],
    }),
    deleteLecturer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/lecturers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecturer'],
    }),

    // Students
    getStudents: builder.query<any[], void>({
      query: () => '/students',
      providesTags: ['Student'],
    }),
    uploadStudentList: builder.mutation<any, any>({
      query: ({ courseId, file }) => {
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
    getSessions: builder.query<any[], void>({
      query: () => '/sessions',
      providesTags: ['Session'],
    }),
    getSession: builder.query<any, string>({
      query: (id) => `/sessions/${id}`,
      providesTags: ['Session'],
    }),
    createSession: builder.mutation<any, any>({
      query: (session) => ({
        url: '/sessions',
        method: 'POST',
        body: session,
      }),
      invalidatesTags: ['Session'],
    }),
    updateSession: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/sessions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Session'],
    }),
    deleteSession: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Session'],
    }),

    // Feedback
    submitFeedback: builder.mutation<any, any>({
      query: (feedback) => ({
        url: '/feedback/submit',
        method: 'POST',
        body: feedback,
      }),
      invalidatesTags: ['Feedback', 'Analytics'],
    }),
    verifyStudent: builder.mutation<any, any>({
      query: ({ sessionId, matriculationNumber }) => ({
        url: '/feedback/verify-student',
        method: 'POST',
        body: { sessionId, matriculationNumber },
      }),
    }),

    // Questionnaires
    getQuestionnaires: builder.query<any[], void>({
      query: () => '/questionnaires',
      providesTags: ['Questionnaire'],
    }),
    createQuestionnaire: builder.mutation<any, any>({
      query: (questionnaire) => ({
        url: '/questionnaires',
        method: 'POST',
        body: questionnaire,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    updateQuestionnaire: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/questionnaires/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    deleteQuestionnaire: builder.mutation<any, string>({
      query: (id) => ({
        url: `/questionnaires/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questionnaire'],
    }),

    // Analytics
    getOverviewAnalytics: builder.query<any, void>({
      query: () => '/analytics/overview',
      providesTags: ['Analytics'],
    }),
    getSessionAnalytics: builder.query<any, string>({
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
