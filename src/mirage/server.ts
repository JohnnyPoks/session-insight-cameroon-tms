import { createServer, Model, Factory, Response } from 'miragejs';

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
        matriculationNumber: (i: number) => `STU${2024000 + i + 1}`,
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
        status: () => 'active',
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
      // Create predefined users for testing
      server.create('user', {
        id: '1',
        username: 'dean@example.com',
        name: 'Dean Administrator',
        role: 'dean'
      });

      server.create('user', {
        id: '2',
        username: 'hod.computerscience@example.com',
        name: 'HOD Computer Science',
        role: 'hod',
        department: 'Computer Science'
      });

      server.create('user', {
        id: '3',
        username: 'hod.electricalengineering@example.com',
        name: 'HOD Electrical Engineering',
        role: 'hod',
        department: 'Electrical Engineering'
      });

      // Create registered users without roles for Dean assignment
      server.create('user', {
        id: '4',
        username: 'emily.davis@university.edu',
        name: 'Dr. Emily Davis',
        role: 'user'
      });

      server.create('user', {
        id: '5',
        username: 'robert.wilson@university.edu',
        name: 'Dr. Robert Wilson',
        role: 'user'
      });

      // Create comprehensive courses across departments
      const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
      departments.forEach((dept, deptIndex) => {
        for (let i = 0; i < 8; i++) {
          server.create('course', {
            id: `${deptIndex * 10 + i + 1}`,
            courseCode: `${dept.substring(0, 3).toUpperCase()}${100 + i}`,
            courseName: `${dept} Course ${i + 1}`,
            department: dept
          });
        }
      });
      
      // Create lecturers across departments
      departments.forEach((dept, deptIndex) => {
        for (let i = 0; i < 6; i++) {
          server.create('lecturer', {
            id: `${deptIndex * 10 + i + 1}`,
            name: `Dr. ${dept} Lecturer ${i + 1}`,
            email: `${dept.toLowerCase().replace(' ', '')}lecturer${i + 1}@university.edu`,
            department: dept
          });
        }
      });
      
      // Create students with specific matriculation numbers for testing
      server.createList('student', 200);
      
      // Create sessions with varied data
      for (let i = 0; i < 100; i++) {
        const deptIndex = i % departments.length;
        const dept = departments[deptIndex];
        server.create('session', {
          id: `${i + 1}`,
          courseCode: `${dept.substring(0, 3).toUpperCase()}${100 + (i % 8)}`,
          courseName: `${dept} Course ${(i % 8) + 1}`,
          instructorName: `Dr. ${dept} Lecturer ${(i % 6) + 1}`,
          department: dept,
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          studentCount: Math.floor(Math.random() * 50) + 20,
          status: ['scheduled', 'open_for_feedback', 'closed'][Math.floor(Math.random() * 3)]
        });
      }
      
      // Create questionnaires
      server.create('questionnaire', {
        id: '1',
        name: 'Standard Teaching Evaluation',
        status: 'active'
      });

      server.create('questionnaire', {
        id: '2',
        name: 'Lab Session Evaluation',
        status: 'active',
        questions: [
          {
            id: '1',
            dimension: 'Clarity & Organization',
            text: 'How well was the lab session organized?',
            type: 'likert'
          },
          {
            id: '2',
            dimension: 'Student Engagement',
            text: 'How interactive was the lab session?',
            type: 'likert'
          },
          {
            id: '3',
            dimension: 'Pedagogical Methods & Activities',
            text: 'How effective were the lab activities?',
            type: 'likert'
          },
          {
            id: '4',
            dimension: 'Content Delivery & Subject Mastery',
            text: 'How well did the instructor demonstrate technical concepts?',
            type: 'likert'
          },
          {
            id: '5',
            dimension: 'Perceived Learning Impact',
            text: 'How much practical knowledge did you gain?',
            type: 'likert'
          },
          {
            id: '6',
            dimension: 'General',
            text: 'Any additional feedback about the lab session?',
            type: 'open_ended'
          }
        ]
      });
      
      // Create diverse feedback with varied scores
      for (let i = 0; i < 500; i++) {
        const sessionId = Math.floor(Math.random() * 100) + 1;
        const baseScore = Math.random() * 5 + 1; // Base score between 1-6
        const variation = 0.5; // Allow some variation in scores
        
        server.create('feedback', {
          id: `${i + 1}`,
          sessionId: `${sessionId}`,
          studentId: `${Math.floor(Math.random() * 200) + 1}`,
          submissionTimestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          scores: {
            'Clarity & Organization': Math.max(1, Math.min(5, Math.round(baseScore + (Math.random() - 0.5) * variation))),
            'Student Engagement': Math.max(1, Math.min(5, Math.round(baseScore + (Math.random() - 0.5) * variation))),
            'Pedagogical Methods & Activities': Math.max(1, Math.min(5, Math.round(baseScore + (Math.random() - 0.5) * variation))),
            'Content Delivery & Subject Mastery': Math.max(1, Math.min(5, Math.round(baseScore + (Math.random() - 0.5) * variation))),
            'Perceived Learning Impact': Math.max(1, Math.min(5, Math.round(baseScore + (Math.random() - 0.5) * variation)))
          },
          openEndedComment: [
            'Great session, very informative.',
            'Could be more interactive.',
            'Excellent teaching style.',
            'Need more examples.',
            'Well structured content.',
            'Too fast paced.',
            'Very engaging instructor.'
          ][Math.floor(Math.random() * 7)]
        });
      }
    },

    routes() {
      this.namespace = 'api';

      // Auth routes - Accept any password for demo purposes
      this.post('/login', (schema, request) => {
        const { username } = JSON.parse(request.requestBody);
        console.log('Login attempt for username:', username);
        
        const user = schema.db.users.findBy({ username });
        console.log('Found user:', user);
        
        if (user) {
          return {
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              role: user.role,
              department: user.department
            },
            token: 'mock-jwt-token-' + user.id
          };
        }
        
        console.log('User not found, returning 401');
        return new Response(401, {}, { error: 'Invalid credentials' });
      });

      // New registration route
      this.post('/register', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        console.log('User registration:', attrs);
        
        const newUser = schema.db.users.insert({
          id: Math.random().toString(36).substr(2, 9),
          username: attrs.username,
          name: attrs.fullName,
          role: 'user',
          department: null
        });
        
        return { success: true, message: 'Registration successful', user: newUser };
      });

      // SEI weights management
      this.post('/sei-weights', (schema, request) => {
        const weights = JSON.parse(request.requestBody);
        console.log('SEI weights saved:', weights);
        return { success: true, message: 'SEI weights saved successfully' };
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
        console.log('Student upload request received');
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
        console.log('Feedback submission received:', attrs);
        return schema.db.feedback.insert({
          ...attrs,
          id: Math.random().toString(36).substr(2, 9),
          submissionTimestamp: new Date().toISOString()
        });
      });

      // Student verification - flexible for demo
      this.post('/feedback/verify-student', (schema, request) => {
        const { sessionId, matriculationNumber } = JSON.parse(request.requestBody);
        console.log('Student verification for:', { sessionId, matriculationNumber });
        
        // Find student by matriculation number or create a demo student
        let student = schema.db.students.findBy({ matriculationNumber });
        const session = schema.db.sessions.find(sessionId);
        
        if (!student) {
          // For demo purposes, accept any matriculation number that starts with STU
          if (matriculationNumber.startsWith('STU')) {
            student = {
              id: Math.random().toString(36).substr(2, 9),
              matriculationNumber: matriculationNumber,
              name: `Demo Student ${matriculationNumber}`,
              email: `${matriculationNumber.toLowerCase()}@student.edu`,
              level: '200',
              coursesRegistered: ['1']
            };
            console.log('Created demo student:', student);
          }
        }
        
        if (student && session) {
          console.log('Student verification successful');
          return { 
            valid: true, 
            student: student, 
            session: session 
          };
        }
        
        console.log('Student verification failed');
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

      // Enhanced analytics routes with filtering
      this.get('/analytics/overview', (schema, request) => {
        const { department, instructor, course, dateRange } = request.queryParams;
        
        let feedback = schema.db.feedback;
        const sessions = schema.db.sessions;
        
        // Apply filters if provided
        if (department && department !== 'all') {
          const filteredSessions = sessions.where({ department });
          const sessionIds = filteredSessions.map(s => s.id);
          feedback = feedback.filter(f => sessionIds.includes(f.sessionId));
        }
        
        const avgSEI = feedback.length > 0 ? 
          feedback.reduce((sum, f) => {
            const scores = f.scores;
            const sei = (scores['Clarity & Organization'] + scores['Student Engagement'] + 
                        scores['Pedagogical Methods & Activities'] + scores['Content Delivery & Subject Mastery'] + 
                        scores['Perceived Learning Impact']) / 5;
            return sum + sei;
          }, 0) / feedback.length : 0;

        return {
          averageSEI: Number(avgSEI.toFixed(2)),
          totalSessions: sessions.length,
          totalFeedback: feedback.length,
          responseRate: 0.785
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
          'Clarity & Organization': sessionFeedback.reduce((sum, f) => sum + f.scores['Clarity & Organization'], 0) / sessionFeedback.length,
          'Student Engagement': sessionFeedback.reduce((sum, f) => sum + f.scores['Student Engagement'], 0) / sessionFeedback.length,
          'Pedagogical Methods & Activities': sessionFeedback.reduce((sum, f) => sum + f.scores['Pedagogical Methods & Activities'], 0) / sessionFeedback.length,
          'Content Delivery & Subject Mastery': sessionFeedback.reduce((sum, f) => sum + f.scores['Content Delivery & Subject Mastery'], 0) / sessionFeedback.length,
          'Perceived Learning Impact': sessionFeedback.reduce((sum, f) => sum + f.scores['Perceived Learning Impact'], 0) / sessionFeedback.length
        };

        const sei = Object.values(averageScores).reduce((sum, score) => sum + score, 0) / 5;

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
