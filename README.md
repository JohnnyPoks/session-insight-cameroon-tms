
# Teaching Management System (TMS) - Cameroon Universities

A comprehensive React/TypeScript frontend prototype for session-level teaching evaluation designed to provide timely, granular feedback for continuous pedagogical improvement in Cameroonian universities.

## 🎯 System Overview

The TMS evaluates individual teaching sessions across five key dimensions:
1. **Clarity & Organization** (Weight: 30%)
2. **Student Engagement** (Weight: 25%)
3. **Pedagogical Methods & Activities** (Weight: 20%)
4. **Content Delivery & Subject Mastery** (Weight: 15%)
5. **Perceived Learning Impact** (Weight: 10%)

A composite **Session Effectiveness Index (SEI)** is calculated based on these weighted dimensions.

## 👥 User Roles

- **Student Evaluator**: Submit anonymous feedback for attended sessions
- **Department Administrator (HOD)**: Manage courses, sessions, evaluation windows, and view department analytics
- **Super-Administrator (Dean)**: Configure system parameters, manage users, and review institution-wide reports

## 🚀 Tech Stack

- **Framework**: React v18+ with TypeScript
- **Build Tool**: Vite
- **UI Components**: Ant Design (AntD v5+)
- **Styling**: Tailwind CSS v3+
- **State Management**: Redux Toolkit + RTK Query
- **Mock API**: Mirage JS
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository** (or extract the project folder)
   ```bash
   git clone <repository-url>
   cd teaching-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Accounts

The system includes pre-configured demo accounts:

| Role | Username | Password | Department |
|------|----------|----------|------------|
| Dean | `dean@example.com` | `password` | All |
| HOD | `hod.computerscience@example.com` | `password` | Computer Science |
| HOD | `hod.electricalengineering@example.com` | `password` | Electrical Engineering |
| HOD | `hod.mathematics@example.com` | `password` | Mathematics |

*Note: Any password will work for demo purposes*

## 📊 Mock Data

The system comes pre-populated with:
- **50 unique teaching sessions** across multiple departments
- **~200 feedback responses per session** (simulated student evaluations)
- **10 courses** across 5 departments
- **15 lecturers** with various academic titles
- **4 administrative users** (1 Dean + 3 HODs)

## 🎨 Features

### 🌟 Core Features
- **Role-based Authentication** with department-specific access
- **Responsive Dashboard** with real-time analytics
- **Session Management** with CRUD operations
- **Anonymous Student Feedback Forms** with 5-point Likert scales
- **SEI Calculation** with configurable dimension weights
- **Data Visualization** using interactive charts
- **Dark/Light Theme Support** with smooth transitions

### 📱 Student Feedback
- Access via unique session URLs (no login required)
- Mobile-optimized responsive design
- Real-time form validation
- Anonymous submission with UUID tracking

### 📈 Analytics & Reporting
- **Overview Dashboard**: Average SEI, response rates, trend analysis
- **Session-level Reports**: Individual session performance metrics
- **Interactive Charts**: Line charts for trends, bar charts for comparisons
- **Export Functionality**: Simulated CSV export capabilities

### 🎛️ Administrative Features
- **Session Management**: Create, edit, delete teaching sessions
- **Evaluation Windows**: Define feedback collection periods
- **Course & Lecturer Management**: Complete CRUD operations
- **System Configuration**: Manage weights and evaluation parameters

## 🏗️ Project Structure

```
src/
├── api/                 # RTK Query API slices
├── app/                 # Redux store configuration
├── components/          # Reusable UI components
│   └── layout/         # Layout components (Sidebar, Header)
├── features/           # Feature-specific components and logic
│   └── auth/           # Authentication slice and components
├── mirage/             # Mock API server configuration
├── pages/              # Top-level page components
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: #1E40AF (Professional Blue)
- **Secondary**: #14B8A6 (Vibrant Teal)
- **Success**: #059669 (Green)
- **Error**: #DC2626 (Red)
- **Neutral**: Tailwind Gray Scale

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🎯 Key URLs

- **Dashboard**: `/dashboard` - Main overview and analytics
- **Sessions**: `/sessions` - Session management interface
- **Student Feedback**: `/feedback/:sessionId` - Anonymous feedback forms
- **Login**: `/login` - Authentication interface

## 🔄 API Endpoints (Mirage JS)

The mock API provides the following endpoints:
- `POST /api/login` - User authentication
- `GET /api/sessions` - Retrieve all sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/feedback/submit` - Submit student feedback
- `GET /api/analytics/overview` - System-wide analytics
- `GET /api/analytics/session/:id` - Session-specific analytics

## 🌟 Notable Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized for tablets and mobile devices
- Collapsible sidebar navigation

### Real-time Updates
- Redux state management for instant UI updates
- Optimistic updates for better user experience
- Loading states and error handling

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- High contrast color schemes

### Performance
- Code splitting with React.lazy (ready for implementation)
- Optimized bundle with Vite
- Efficient state management with RTK Query caching

## 🚧 Future Enhancements

- Complete course and lecturer management pages
- Advanced analytics with custom date ranges
- Email notifications for evaluation reminders
- Bulk import/export functionality
- Multi-language support (French/English)
- Real-time collaboration features

## 📱 Mobile Support

The application is fully responsive and optimized for:
- **Mobile phones** (320px and up)
- **Tablets** (768px and up)
- **Desktop** (1024px and up)
- **Large screens** (1440px and up)

## 🎨 Theme Customization

The application supports both light and dark themes with:
- Smooth transitions between themes
- Persistent theme selection
- System preference detection
- Customizable color tokens in Tailwind config

---

## 📞 Support

For questions or issues with this prototype:
1. Check the browser console for any errors
2. Verify all dependencies are installed correctly
3. Ensure you're using a supported Node.js version (16+)

---

**Built with ❤️ for Cameroonian Universities**

*This prototype demonstrates modern web development practices and provides a solid foundation for a production-ready Teaching Management System.*
