
import { createServer, Model, Factory } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      user: Model,
      course: Model,
      lecturer: Model,
      student: Model,
      session: Model,
      feedback: Model,
      questionnaire: Model,
    },

    factories: {
      user: Factory.extend({
        username: (i: number) => `user${i}@example.com`,
        name: (i: number) => `User ${i}`,
        role: () => 'hod',
        department: () => 'Computer Science',
      }),

      course: Factory.extend({
        courseCode: (i: number) => `CS${100 + i}`,
        courseName: (i: number) => `Course ${i + 1}`,
        department: () => 'Computer Science',
        credits: () => 3,
      }),

      lecturer: Factory.extend({
        name: (i: number) => `Dr. Lecturer ${i + 1}`,
        email: (i: number) => `lecturer${i + 1}@university.edu`,
        department: () => 'Computer Science',
        title: () => 'Dr.',
      }),

      student: Factory.extend({
        matriculationNumber: (i: number) => `STU${2024000 + i}`,
        name: (i: number) => `Student ${i + 1}`,
        email: (i: number) => `student${i + 1}@university.edu`,
        level: (i: number) => ['100', '200', '300', '400'][i % 4],
        coursesRegistered: () => ['1', '2'],
      }),

      session: Factory.extend({
        courseCode: (i: number) => `CS${100 + (i % 10)}`,
        courseName: (i: number) => `Course ${(i % 10) + 1}`,
        instructorName: (i: number) => `Dr. Instructor ${(i % 15) + 1}`,
        department: () => 'Computer Science',
        date: () => new Date().toISOString(),
        time: () => '10:00',
        studentCount: () => Math.floor(Math.random() * 50) + 20,
        status: () => 'open_for_feedback',
        questionnaireId: () => '1',
      }),

      feedback: Factory.extend({
        sessionId: (i: number) => `${(i % 50) + 1}`,
        studentId: (i: number) => `${(i % 100) + 1}`,
        submissionTimestamp: () => new Date().toISOString(),
        scores: () => ({
          'Clarity & Organization': Math.floor(Math.random() * 5) + 1,
          'Student Engagement': Math.floor(Math.random() * 5) + 1,
          'Pedagogical Methods & Activities': Math.floor(Math.random() * 5) + 1,
          'Content Delivery & Subject Mastery': Math.floor(Math.random() * 5) + 1,
          'Perceived Learning Impact': Math.floor(Math.random() * 5) + 1,
        }),
        openEndedComment: () => 'Good session overall.',
      }),

      questionnaire: Factory.extend({
        name: () => 'Standard Teaching Evaluation',
        questions: () => [
          {
            id: '1',
            dimension: 'Clarity & Organization',
            text: 'How clear and well-organized was this session?',
            type: 'likert'
          },
          {
            id: '2',
            dimension: 'Student Engagement',
            text: 'How engaging was the instructor?',
            type: 'likert'
          },
          {
            id: '3',
            dimension: 'Pedagogical Methods & Activities',
            text: 'How effective were the teaching methods?',
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
            text: 'How much did you learn from this session?',
            type: 'likert'
          },
          {
            id: '6',
            dimension: 'General',
            text: 'Please provide additional comments.',
            type: 'open_ended'
          }
        ],
      }),
    },

    seeds(server) {
      // Create users
      server.create('user', {
        id: '1',
        username: 'dean@example.com',
        name: 'Dean Administrator',
        role: 'dean'
      });

      server.create('user', {
        id: '2',
        username: 'hod.cs@example.com',
        name: 'HOD Computer Science',
        role: 'hod',
        department: 'Computer Science'
      });

      server.create('user', {
        id: '3',
        username: 'hod.ee@example.com',
        name: 'HOD Electrical Engineering',
        role: 'hod',
        department: 'Electrical Engineering'
      });

      // Create courses
      server.createList('course', 10);
      
      // Create lecturers
      server.createList('lecturer', 15);
      
      // Create students
      server.createList('student', 100);
      
      // Create sessions
      server.createList('session', 50);
      
      // Create questionnaires
      server.create('questionnaire', {
        id: '1',
        name: 'Standard Teaching Evaluation'
      });
      
      // Create feedback
      server.createList('feedback', 200);
    },

    routes() {
      this.namespace = 'api';

      // Auth routes
      this.post('/login', (schema, request) => {
        const { username } = JSON.parse(request.requestBody);
        const user = schema.db.users.findBy({ username });
        
        if (user) {
          return {
            user,
            token: 'mock-jwt-token'
          };
        }
        
        return new Response(401, {}, { error: 'Invalid credentials' });
      });

      // Course routes
      this.get('/courses', (schema) => {
        return schema.db.courses;
      });

      this.post('/courses', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.db.courses.insert(attrs);
      });

      this.put('/courses/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        return schema.db.courses.update(id, attrs);
      });

      this.delete('/courses/:id', (schema, request) => {
        const id = request.params.id;
        schema.db.courses.remove(id);
        return new Response(204);
      });

      // Lecturer routes
      this.get('/lecturers', (schema) => {
        return schema.db.lecturers;
      });

      this.post('/lecturers', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.db.lecturers.insert(attrs);
      });

      this.put('/lecturers/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        return schema.db.lecturers.update(id, attrs);
      });

      this.delete('/lecturers/:id', (schema, request) => {
        const id = request.params.id;
        schema.db.lecturers.remove(id);
        return new Response(204);
      });

      // Student routes
      this.get('/students', (schema) => {
        return schema.db.students;
      });

      this.post('/students/upload', (schema, request) => {
        // Simulate file upload processing
        return { success: true, message: 'Student list uploaded successfully' };
      });

      // Session routes
      this.get('/sessions', (schema) => {
        return schema.db.sessions;
      });

      this.get('/sessions/:id', (schema, request) => {
        const id = request.params.id;
        return schema.db.sessions.find(id);
      });

      this.post('/sessions', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.db.sessions.insert(attrs);
      });

      this.put('/sessions/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        return schema.db.sessions.update(id, attrs);
      });

      this.delete('/sessions/:id', (schema, request) => {
        const id = request.params.id;
        schema.db.sessions.remove(id);
        return new Response(204);
      });

      // Feedback routes
      this.post('/feedback/submit', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.db.feedback.insert({
          ...attrs,
          id: Math.random().toString(36).substr(2, 9),
          submissionTimestamp: new Date().toISOString()
        });
      });

      this.post('/feedback/verify-student', (schema, request) => {
        const { sessionId, matriculationNumber } = JSON.parse(request.requestBody);
        const student = schema.db.students.findBy({ matriculationNumber });
        const session = schema.db.sessions.find(sessionId);
        
        if (student && session) {
          return { valid: true, student, session };
        }
        
        return new Response(400, {}, { error: 'Student not found or not enrolled in this course' });
      });

      // Questionnaire routes
      this.get('/questionnaires', (schema) => {
        return schema.db.questionnaires;
      });

      this.post('/questionnaires', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.db.questionnaires.insert(attrs);
      });

      this.put('/questionnaires/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        return schema.db.questionnaires.update(id, attrs);
      });

      this.delete('/questionnaires/:id', (schema, request) => {
        const id = request.params.id;
        schema.db.questionnaires.remove(id);
        return new Response(204);
      });

      // Analytics routes
      this.get('/analytics/overview', (schema) => {
        const feedback = schema.db.feedback;
        const sessions = schema.db.sessions;
        
        const avgSEI = feedback.length > 0 ? 
          feedback.reduce((sum: number, f: any) => {
            const scores = f.scores;
            const sei = (scores['Clarity & Organization'] + scores['Student Engagement'] + 
                        scores['Pedagogical Methods & Activities'] + scores['Content Delivery & Subject Mastery'] + 
                        scores['Perceived Learning Impact']) / 5;
            return sum + sei;
          }, 0) / feedback.length : 0;

        return {
          averageSEI: avgSEI,
          totalSessions: sessions.length,
          totalFeedback: feedback.length,
          responseRate: 0.75
        };
      });

      this.get('/analytics/session/:sessionId', (schema, request) => {
        const sessionId = request.params.sessionId;
        const sessionFeedback = schema.db.feedback.where({ sessionId });
        
        if (sessionFeedback.length === 0) {
          return {
            sessionId,
            averageScores: {
              'Clarity & Organization': 0,
              'Student Engagement': 0,
              'Pedagogical Methods & Activities': 0,
              'Content Delivery & Subject Mastery': 0,
              'Perceived Learning Impact': 0
            },
            sei: 0,
            responseCount: 0,
            responseRate: 0
          };
        }

        const averageScores = {
          'Clarity & Organization': sessionFeedback.reduce((sum: number, f: any) => sum + f.scores['Clarity & Organization'], 0) / sessionFeedback.length,
          'Student Engagement': sessionFeedback.reduce((sum: number, f: any) => sum + f.scores['Student Engagement'], 0) / sessionFeedback.length,
          'Pedagogical Methods & Activities': sessionFeedback.reduce((sum: number, f: any) => sum + f.scores['Pedagogical Methods & Activities'], 0) / sessionFeedback.length,
          'Content Delivery & Subject Mastery': sessionFeedback.reduce((sum: number, f: any) => sum + f.scores['Content Delivery & Subject Mastery'], 0) / sessionFeedback.length,
          'Perceived Learning Impact': sessionFeedback.reduce((sum: number, f: any) => sum + f.scores['Perceived Learning Impact'], 0) / sessionFeedback.length
        };

        const sei = Object.values(averageScores).reduce((sum: number, score: number) => sum + score, 0) / 5;

        return {
          sessionId,
          averageScores,
          sei,
          responseCount: sessionFeedback.length,
          responseRate: 0.8
        };
      });
    },
  });
}
