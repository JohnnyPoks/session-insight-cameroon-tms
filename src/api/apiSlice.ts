
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
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Courses
    getCourses: builder.query({
      query: (params = {}) => ({
        url: '/courses',
        params,
      }),
      providesTags: ['Course'],
    }),
    createCourse: builder.mutation({
      query: (course) => ({
        url: '/courses',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),

    // Lecturers
    getLecturers: builder.query({
      query: (params = {}) => ({
        url: '/lecturers',
        params,
      }),
      providesTags: ['Lecturer'],
    }),
    createLecturer: builder.mutation({
      query: (lecturer) => ({
        url: '/lecturers',
        method: 'POST',
        body: lecturer,
      }),
      invalidatesTags: ['Lecturer'],
    }),
    updateLecturer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/lecturers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Lecturer'],
    }),
    deleteLecturer: builder.mutation({
      query: (id) => ({
        url: `/lecturers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecturer'],
    }),

    // Students
    getStudents: builder.query({
      query: (params = {}) => ({
        url: '/students',
        params,
      }),
      providesTags: ['Student'],
    }),
    uploadStudentList: builder.mutation({
      query: ({ courseId, level, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseId', courseId);
        formData.append('level', level);
        return {
          url: '/students/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Student'],
    }),

    // Sessions
    getSessions: builder.query({
      query: (params = {}) => ({
        url: '/sessions',
        params,
      }),
      providesTags: ['Session'],
    }),
    getSession: builder.query({
      query: (id) => `/sessions/${id}`,
      providesTags: ['Session'],
    }),
    createSession: builder.mutation({
      query: (session) => ({
        url: '/sessions',
        method: 'POST',
        body: session,
      }),
      invalidatesTags: ['Session'],
    }),
    updateSession: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sessions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Session'],
    }),
    deleteSession: builder.mutation({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Session'],
    }),

    // Feedback
    submitFeedback: builder.mutation({
      query: (feedback) => ({
        url: '/feedback/submit',
        method: 'POST',
        body: feedback,
      }),
      invalidatesTags: ['Feedback', 'Analytics'],
    }),
    verifyStudent: builder.mutation({
      query: ({ sessionId, matriculationNumber }) => ({
        url: '/feedback/verify-student',
        method: 'POST',
        body: { sessionId, matriculationNumber },
      }),
    }),

    // Questionnaires
    getQuestionnaires: builder.query({
      query: (params = {}) => ({
        url: '/questionnaires',
        params,
      }),
      providesTags: ['Questionnaire'],
    }),
    createQuestionnaire: builder.mutation({
      query: (questionnaire) => ({
        url: '/questionnaires',
        method: 'POST',
        body: questionnaire,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    updateQuestionnaire: builder.mutation({
      query: ({ id, data }) => ({
        url: `/questionnaires/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    deleteQuestionnaire: builder.mutation({
      query: (id) => ({
        url: `/questionnaires/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questionnaire'],
    }),

    // Analytics
    getOverviewAnalytics: builder.query({
      query: (params = {}) => ({
        url: '/analytics/overview',
        params,
      }),
      providesTags: ['Analytics'],
    }),
    getSessionAnalytics: builder.query({
      query: (sessionId) => `/analytics/session/${sessionId}`,
      providesTags: ['Analytics'],
    }),

    // SEI Weights
    saveSEIWeights: builder.mutation({
      query: (weights) => ({
        url: '/sei-weights',
        method: 'POST',
        body: weights,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
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
  useSaveSEIWeightsMutation,
} = apiSlice;
