
import { createServer, Factory, Model, Response } from 'miragejs';
import { v4 as uuidv4 } from 'uuid';
import type { User, Course, Lecturer, Session, Feedback, FeedbackScores } from '../types';

const departments = ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics', 'Chemistry'];
const courses = [
  { code: 'CS101', name: 'Introduction to Programming', dept: 'Computer Science' },
  { code: 'CS201', name: 'Data Structures & Algorithms', dept: 'Computer Science' },
  { code: 'EE205', name: 'Circuit Theory', dept: 'Electrical Engineering' },
  { code: 'EE301', name: 'Digital Signal Processing', dept: 'Electrical Engineering' },
  { code: 'MATH201', name: 'Calculus II', dept: 'Mathematics' },
  { code: 'MATH301', name: 'Linear Algebra', dept: 'Mathematics' },
  { code: 'PHY201', name: 'Classical Mechanics', dept: 'Physics' },
  { code: 'PHY301', name: 'Quantum Physics', dept: 'Physics' },
  { code: 'CHEM201', name: 'Organic Chemistry', dept: 'Chemistry' },
  { code: 'CHEM301', name: 'Physical Chemistry', dept: 'Chemistry' }
];

const lecturerNames = [
  'Dr. Jean Mbarga', 'Prof. Marie Nkomo', 'Dr. Paul Essomba', 'Prof. Grace Fouda',
  'Dr. Michel Atangana', 'Prof. Sarah Ndongo', 'Dr. Pierre Biya', 'Prof. Catherine Muna',
  'Dr. Daniel Foe', 'Prof. Annette Mballa', 'Dr. Francis Ndi', 'Prof. Beatrice Ekane',
  'Dr. Joseph Tchouto', 'Prof. Lydie Manga', 'Dr. Emmanuel Njoya'
];

const generateRandomScore = () => Math.floor(Math.random() * 5) + 1;

const generateFeedbackScores = (): FeedbackScores => ({
  'Clarity & Organization': generateRandomScore(),
  'Student Engagement': generateRandomScore(),
  'Pedagogical Methods & Activities': generateRandomScore(),
  'Content Delivery & Subject Mastery': generateRandomScore(),
  'Perceived Learning Impact': generateRandomScore()
});

const calculateAverageScores = (feedbackList: any[]): FeedbackScores => {
  const dimensions = [
    'Clarity & Organization',
    'Student Engagement', 
    'Pedagogical Methods & Activities',
    'Content Delivery & Subject Mastery',
    'Perceived Learning Impact'
  ] as const;

  const avgScores = {} as FeedbackScores;
  
  dimensions.forEach(dim => {
    const total = feedbackList.reduce((sum, feedback) => sum + feedback.scores[dim], 0);
    avgScores[dim] = total / feedbackList.length;
  });

  return avgScores;
};

const calculateSEI = (scores: FeedbackScores): number => {
  const weights: Record<keyof FeedbackScores, number> = {
    'Clarity & Organization': 0.30,
    'Student Engagement': 0.25,
    'Pedagogical Methods & Activities': 0.20,
    'Content Delivery & Subject Mastery': 0.15,
    'Perceived Learning Impact': 0.10
  };

  let sei = 0;
  Object.entries(scores).forEach(([dimension, score]) => {
    sei += score * weights[dimension as keyof FeedbackScores];
  });

  return sei;
};

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      user: Model,
      course: Model,
      lecturer: Model,
      session: Model,
      feedback: Model,
      questionnaire: Model,
    },

    factories: {
      user: Factory.extend({
        id() { return uuidv4(); },
        name(i: number) {
          if (i === 0) return 'Dean Administrator';
          return `HOD ${departments[i - 1]}`;
        },
        username(i: number) {
          if (i === 0) return 'dean@example.com';
          const dept = departments[i - 1].toLowerCase().replace(/\s+/g, '');
          return `hod.${dept}@example.com`;
        },
        role(i: number) {
          return i === 0 ? 'dean' : 'hod';
        },
        department(i: number) {
          return i === 0 ? undefined : departments[i - 1];
        }
      }),

      course: Factory.extend({
        id() { return uuidv4(); },
        courseCode(i: number) { return courses[i].code; },
        courseName(i: number) { return courses[i].name; },
        department(i: number) { return courses[i].dept; },
        credits() { return Math.floor(Math.random() * 4) + 2; }
      }),

      lecturer: Factory.extend({
        id() { return uuidv4(); },
        name(i: number) { return lecturerNames[i]; },
        email(i: number) {
          const name = lecturerNames[i].toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '.');
          return `${name}@university.cm`;
        },
        department(i: number) { return departments[i % departments.length]; },
        title(i: number) { return i % 3 === 0 ? 'Professor' : 'Dr.'; }
      }),

      session: Factory.extend({
        id() { return uuidv4(); },
        courseCode(i: number) { return courses[i % courses.length].code; },
        courseName(i: number) { return courses[i % courses.length].name; },
        instructorName(i: number) { return lecturerNames[i % lecturerNames.length]; },
        department(i: number) { return courses[i % courses.length].dept; },
        date() {
          const start = new Date(2024, 0, 1);
          const end = new Date(2024, 11, 31);
          const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
          return randomDate.toISOString();
        },
        time() {
          const hours = ['08:00', '10:00', '12:00', '14:00', '16:00'];
          return hours[Math.floor(Math.random() * hours.length)];
        },
        studentCount() { return Math.floor(Math.random() * 80) + 20; },
        status() {
          const statuses = ['scheduled', 'open_for_feedback', 'closed'];
          return statuses[Math.floor(Math.random() * statuses.length)];
        },
        questionnaireId() { return 'default-questionnaire'; }
      }),

      feedback: Factory.extend({
        id() { return uuidv4(); },
        studentId() { return uuidv4(); },
        submissionTimestamp() { return new Date().toISOString(); },
        scores() { return generateFeedbackScores(); },
        openEndedComment() {
          const comments = [
            'Excellent session with clear explanations.',
            'Good content but could use more interactive elements.',
            'Very engaging and well-structured.',
            'Some concepts were difficult to follow.',
            'Great use of examples and practical applications.',
            'Would benefit from more student participation.',
            'Outstanding teaching methodology.',
            'Clear delivery but pace was a bit fast.'
          ];
          return comments[Math.floor(Math.random() * comments.length)];
        }
      }),

      questionnaire: Factory.extend({
        id() { return uuidv4(); },
        name() { return 'Default Teaching Evaluation Questionnaire'; }
      })
    },

    seeds(server) {
      server.createList('user', 4);
      server.createList('course', 10);
      server.createList('lecturer', 15);
      const sessions = server.createList('session', 50);
      server.create('questionnaire');
      
      sessions.forEach(session => {
        const feedbackCount = Math.floor(Math.random() * 50) + 150;
        for (let i = 0; i < feedbackCount; i++) {
          server.create('feedback', { sessionId: session.id });
        }
      });
    },

    routes() {
      this.namespace = 'api';

      this.post('/login', (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        const user = schema.db.users.findBy({ username });
        
        if (user) {
          return {
            token: 'mock-jwt-token',
            user: user
          };
        }
        
        return new Response(401, {}, { error: 'Invalid credentials' });
      });

      this.resource('courses');
      this.resource('lecturers');
      this.resource('sessions');
      this.resource('feedback');
      this.resource('questionnaires');

      this.get('/analytics/overview', (schema) => {
        const sessions = schema.db.sessions;
        const feedback = schema.db.feedback;
        
        let totalSEI = 0;
        let sessionCount = 0;

        sessions.forEach((session: any) => {
          const sessionFeedback = feedback.where({ sessionId: session.id });
          if (sessionFeedback.length > 0) {
            const avgScores = calculateAverageScores(sessionFeedback);
            const sei = calculateSEI(avgScores);
            totalSEI += sei;
            sessionCount++;
          }
        });

        return {
          averageSEI: sessionCount > 0 ? totalSEI / sessionCount : 0,
          totalSessions: sessions.length,
          totalFeedback: feedback.length,
          responseRate: 0.85
        };
      });

      this.get('/analytics/session/:id', (schema, request) => {
        const sessionId = request.params.id;
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
            } as FeedbackScores,
            sei: 0,
            responseCount: 0,
            responseRate: 0
          };
        }

        const avgScores = calculateAverageScores(sessionFeedback);
        const sei = calculateSEI(avgScores);

        return {
          sessionId,
          averageScores: avgScores,
          sei,
          responseCount: sessionFeedback.length,
          responseRate: 0.85
        };
      });

      this.post('/feedback/submit', (schema, request) => {
        const feedbackData = JSON.parse(request.requestBody);
        const feedback = schema.create('feedback', {
          ...feedbackData,
          id: uuidv4(),
          submissionTimestamp: new Date().toISOString()
        });
        return feedback;
      });
    }
  });
}
