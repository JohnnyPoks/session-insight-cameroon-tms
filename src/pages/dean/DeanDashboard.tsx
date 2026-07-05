import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Tag,
  DatePicker,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  useGetOverviewAnalyticsQuery,
  useGetSessionsQuery,
  useGetCoursesQuery,
  useGetLecturersQuery,
} from "../../api/apiSlice";
import dayjs, { Dayjs } from "dayjs";
import CourseDetailsModal from "../../components/CourseDetailsModal";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DeanDashboard: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const { data: analytics, isLoading: analyticsLoading } = useGetOverviewAnalyticsQuery();
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionsQuery();
  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery();
  const { data: lecturers, isLoading: lecturersLoading } = useGetLecturersQuery();

  // Mock data for faculty-wide analytics
  const facultyTrendData = [
    { month: "Jan", sei: 3.8, responses: 2400 },
    { month: "Feb", sei: 4.0, responses: 2600 },
    { month: "Mar", sei: 4.2, responses: 2800 },
    { month: "Apr", sei: 4.1, responses: 2650 },
    { month: "May", sei: 4.3, responses: 2900 },
    { month: "Jun", sei: 4.4, responses: 3100 },
  ];

  const departmentComparisonData = [
    { department: "Computer", sei: 4.2 },
    { department: "Mathematics", sei: 3.9 },
    { department: "Physics", sei: 4.0 },
    { department: "Chemistry", sei: 3.8 },
    { department: "Biology", sei: 4.1 },
  ];

  const responseDistributionData = [
    { name: "Excellent (5)", value: 35, color: "#52c41a" },
    { name: "Good (4)", value: 30, color: "#1890ff" },
    { name: "Average (3)", value: 20, color: "#faad14" },
    { name: "Poor (2)", value: 10, color: "#fa8c16" },
    { name: "Very Poor (1)", value: 5, color: "#f5222d" },
  ];

  const dimensionScoresData = [
    { dimension: "Clarity", score: 4.2 },
    { dimension: "Engagement", score: 4.0 },
    { dimension: "Methods", score: 3.9 },
    { dimension: "Content", score: 4.1 },
    { dimension: "Learning", score: 4.0 },
  ];

  const engagementData = [
    { department: "Computer", engagement: 4.3, faculty_avg: 4.0 },
    { department: "Mathematics", engagement: 3.7, faculty_avg: 4.0 },
    { department: "Physics", engagement: 4.1, faculty_avg: 4.0 },
    { department: "Chemistry", engagement: 3.6, faculty_avg: 4.0 },
    { department: "Biology", engagement: 4.2, faculty_avg: 4.0 },
  ];

  const departments = [
    "Computer",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
  ];

  // Add this mock data after the other mock data declarations
  const departmentDimensionScores = [
    {
      department: "Computer",
      Clarity: 4.2,
      Engagement: 4.0,
      Methods: 3.9,
      Content: 4.1,
      Learning: 4.0,
    },
    {
      department: "Mathematics",
      Clarity: 4.0,
      Engagement: 3.8,
      Methods: 3.7,
      Content: 4.2,
      Learning: 3.9,
    },
    {
      department: "Physics",
      Clarity: 4.1,
      Engagement: 4.2,
      Methods: 4.0,
      Content: 4.0,
      Learning: 4.1,
    },
    {
      department: "Chemistry",
      Clarity: 3.8,
      Engagement: 3.7,
      Methods: 3.9,
      Content: 3.8,
      Learning: 3.9,
    },
    {
      department: "Biology",
      Clarity: 4.3,
      Engagement: 4.1,
      Methods: 4.2,
      Content: 4.1,
      Learning: 4.2,
    },
  ];

  // Compute top performing course and highest dimension score from the dummy data
  const topCourses = [
    {
      key: "1",
      rank: 1,
      course: "CS101 - Intro to Programming",
      instructor: "Dr. Smith",
      department: "Computer Science",
      sei: 4.8,
      clarity: 4.9,
      engagement: 4.7,
      methods: 4.8,
      content: 4.7,
      learning: 4.8,
    },
    {
      key: "2",
      rank: 2,
      course: "MATH201 - Calculus II",
      instructor: "Dr. Johnson",
      department: "Mathematics",
      sei: 4.7,
      clarity: 4.6,
      engagement: 4.7,
      methods: 4.7,
      content: 4.8,
      learning: 4.6,
    },
    {
      key: "3",
      rank: 3,
      course: "PHY301 - Quantum Physics",
      instructor: "Dr. Brown",
      department: "Physics",
      sei: 4.6,
      clarity: 4.5,
      engagement: 4.6,
      methods: 4.5,
      content: 4.6,
      learning: 4.7,
    },
    {
      key: "4",
      rank: 4,
      course: "CHEM101 - General Chemistry",
      instructor: "Dr. White",
      department: "Chemistry",
      sei: 4.5,
      clarity: 4.4,
      engagement: 4.5,
      methods: 4.6,
      content: 4.5,
      learning: 4.5,
    },
    {
      key: "5",
      rank: 5,
      course: "BIO201 - Cell Biology",
      instructor: "Dr. Green",
      department: "Biology",
      sei: 4.4,
      clarity: 4.3,
      engagement: 4.4,
      methods: 4.3,
      content: 4.4,
      learning: 4.3,
    },
  ];
  const dimensionNames = [
    "clarity",
    "engagement",
    "methods",
    "content",
    "learning",
  ];


  // 1. Create varied dummy data for departments and courses
  const departmentData = [
    {
      department: "Computer Science",
      clarity: 4.7,
      engagement: 3.2,
      methods: 4.9,
      content: 2.8,
      learning: 4.1,
    },
    {
      department: "Mathematics",
      clarity: 2.9,
      engagement: 4.8,
      methods: 3.1,
      content: 4.5,
      learning: 3.7,
    },
    {
      department: "Physics",
      clarity: 3.5,
      engagement: 2.7,
      methods: 4.2,
      content: 4.8,
      learning: 2.9,
    },
    {
      department: "Chemistry",
      clarity: 4.1,
      engagement: 4.6,
      methods: 2.8,
      content: 3.2,
      learning: 4.9,
    },
    {
      department: "Biology",
      clarity: 3.2,
      engagement: 3.9,
      methods: 4.5,
      content: 4.3,
      learning: 2.6,
    },
  ];

  const courseData = [
    {
      course: "CS101 - Intro to Programming",
      department: "Computer Science",
      instructor: "Dr. Smith",
      clarity: 4.8,
      engagement: 3.1,
      methods: 4.7,
      content: 2.9,
      learning: 4.2,
    },
    {
      course: "CS201 - Data Structures",
      department: "Computer Science",
      instructor: "Dr. Ada",
      clarity: 4.6,
      engagement: 3.3,
      methods: 4.8,
      content: 2.7,
      learning: 4.0,
    },
    {
      course: "MATH201 - Calculus II",
      department: "Mathematics",
      instructor: "Dr. Johnson",
      clarity: 2.8,
      engagement: 4.9,
      methods: 3.0,
      content: 4.6,
      learning: 3.8,
    },
    {
      course: "MATH301 - Linear Algebra",
      department: "Mathematics",
      instructor: "Dr. Euler",
      clarity: 3.0,
      engagement: 4.7,
      methods: 3.2,
      content: 4.4,
      learning: 3.6,
    },
    {
      course: "PHY301 - Quantum Physics",
      department: "Physics",
      instructor: "Dr. Brown",
      clarity: 3.6,
      engagement: 2.8,
      methods: 4.1,
      content: 4.7,
      learning: 3.0,
    },
    {
      course: "PHY201 - Mechanics",
      department: "Physics",
      instructor: "Dr. Newton",
      clarity: 3.4,
      engagement: 2.6,
      methods: 4.3,
      content: 4.9,
      learning: 2.8,
    },
    {
      course: "CHEM101 - General Chemistry",
      department: "Chemistry",
      instructor: "Dr. White",
      clarity: 4.0,
      engagement: 4.7,
      methods: 2.7,
      content: 3.1,
      learning: 4.8,
    },
    {
      course: "CHEM201 - Organic Chemistry",
      department: "Chemistry",
      instructor: "Dr. Curie",
      clarity: 4.2,
      engagement: 4.5,
      methods: 2.9,
      content: 3.3,
      learning: 5.0,
    },
    {
      course: "BIO201 - Cell Biology",
      department: "Biology",
      instructor: "Dr. Green",
      clarity: 3.1,
      engagement: 3.8,
      methods: 4.6,
      content: 4.2,
      learning: 2.7,
    },
    {
      course: "BIO301 - Genetics",
      department: "Biology",
      instructor: "Dr. Mendel",
      clarity: 3.3,
      engagement: 4.0,
      methods: 4.4,
      content: 4.4,
      learning: 2.5,
    },
  ];

  // 2. Calculate SEI for departments and courses
  const addSEI = (item) => ({
    ...item,
    sei: Number(((item.clarity + item.engagement + item.methods + item.content + item.learning) / 5).toFixed(2)),
  });
  const departmentDataWithSEI = departmentData.map(addSEI);
  const courseDataWithSEI = courseData.map(addSEI);

  // 3. Calculate KPIs from the data
  const avgSEI = (
    departmentDataWithSEI.reduce((sum, d) => sum + d.sei, 0) / departmentDataWithSEI.length
  ).toFixed(2);
  const topDepartment = departmentDataWithSEI.reduce((a, b) => (a.sei > b.sei ? a : b));
  const topCourse = courseDataWithSEI.reduce((a, b) => (a.sei > b.sei ? a : b));
  let highestDimension = { name: '', course: '', value: 0 };
  courseDataWithSEI.forEach((c) => {
    ['clarity', 'engagement', 'methods', 'content', 'learning'].forEach((dim) => {
      if (c[dim] > highestDimension.value) {
        highestDimension = {
          name: dim.charAt(0).toUpperCase() + dim.slice(1),
          course: c.course,
          value: c[dim],
        };
      }
    });
  });

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);

  // Helper to open modal with course info
  const handleCourseClick = (courseName) => {
    // Find course in courseDataWithSEI
    const course = courseDataWithSEI.find((c) => c.course === courseName);
    if (course) {
      setModalCourse({
        courseId: course.courseCode || course.course || course.key || courseName, // fallback if no code
        courseName: course.course,
        departmentName: course.department,
      });
      setModalVisible(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <Title level={2} className="mb-1">
            Faculty Analytics Dashboard
          </Title>
          <Text className="text-gray-600">
            Comprehensive faculty-wide performance overview
          </Text>
        </div>
      </div>

      {/* Key Statistical Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300 p-2">
            <Statistic
              title={
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                  Average Session Evaluation Index
                </span>
              }
              value={4.0}
              precision={2}
              valueStyle={{
                color: "#14B8A6",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300 p-2">
            <Statistic
              title={
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                  Top Performing Department
                </span>
              }
              value={topDepartment.department}
              valueStyle={{
                color: "#1E40AF",
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
              suffix={
                <span
                  style={{ color: "#14B8A6", marginLeft: 8, fontSize: "1rem" }}
                >
                  ({topDepartment.sei})
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300 p-2">
            <Statistic
              title={
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                  Top Performing Course
                </span>
              }
              value={topCourse.course}
              valueStyle={{
                color: "#7C3AED",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
              suffix={
                <span
                  style={{ color: "#14B8A6", marginLeft: 8, fontSize: "1rem" }}
                >
                  ({topCourse.sei} SEI)
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300 p-2">
            <Statistic
              title={
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                  Highest Dimension Score
                </span>
              }
              value={`${highestDimension.name}: ${highestDimension.course}`}
              valueStyle={{
                color: "#faad14",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
              suffix={
                <span
                  style={{ color: "#14B8A6", marginLeft: 8, fontSize: "1rem" }}
                >
                  ({highestDimension.value})
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Core Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="SEI Trend"
            style={{ height: 400 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={facultyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sei" 
                  stroke="#1E40AF" 
                  strokeWidth={3}
                  dot={{ fill: "#1E40AF", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Department SEI Comparison" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="sei" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title="Department Dimension Scores (Grouped Bar Chart)"
            style={{ height: 450 }}
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={departmentDimensionScores}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Clarity" fill="#1E40AF" />
                <Bar dataKey="Engagement" fill="#14B8A6" />
                <Bar dataKey="Methods" fill="#7C3AED" />
                <Bar dataKey="Content" fill="#faad14" />
                <Bar dataKey="Learning" fill="#f5222d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Ranking Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Top Performing Sessions (by SEI and Dimensions)">
            <Table
              columns={[
                {
                  title: "Rank",
                  dataIndex: "rank",
                  key: "rank",
                  width: 70,
                  sorter: (a, b) => a.rank - b.rank,
                },
                {
                  title: "Course",
                  dataIndex: "course",
                  key: "course",
                  render: (text, record) => (
                    <a
                      style={{ color: "#1E40AF", cursor: "pointer", fontWeight: 500 }}
                      onClick={() => handleCourseClick(record.course)}
                    >
                      {text}
                    </a>
                  ),
                },
                {
                  title: "Instructor",
                  dataIndex: "instructor",
                  key: "instructor",
                },
                {
                  title: "Department",
                  dataIndex: "department",
                  key: "department",
                  filters: [
                    { text: "All Departments", value: "all" },
                    ...departments.map((dept) => ({ text: dept, value: dept })),
                  ],
                  onFilter: (value, record) =>
                    value === "all" ? true : record.department === value,
                },
                {
                  title: "SEI",
                  dataIndex: "sei",
                  key: "sei",
                  sorter: (a, b) => a.sei - b.sei,
                  render: (sei) => (
                    <Tag
                      color={
                        sei >= 4.5
                          ? "green"
                          : sei >= 4.0
                          ? "blue"
                          : sei >= 3.5
                          ? "orange"
                          : "red"
                      }
                    >
                      {sei.toFixed(1)}
                    </Tag>
                  ),
                },
                {
                  title: "Clarity",
                  dataIndex: "clarity",
                  key: "clarity",
                  sorter: (a, b) => a.clarity - b.clarity,
                },
                {
                  title: "Engagement",
                  dataIndex: "engagement",
                  key: "engagement",
                  sorter: (a, b) => a.engagement - b.engagement,
                },
                {
                  title: "Methods",
                  dataIndex: "methods",
                  key: "methods",
                  sorter: (a, b) => a.methods - b.methods,
                },
                {
                  title: "Content",
                  dataIndex: "content",
                  key: "content",
                  sorter: (a, b) => a.content - b.content,
                },
                {
                  title: "Learning",
                  dataIndex: "learning",
                  key: "learning",
                  sorter: (a, b) => a.learning - b.learning,
                },
              ]}
              dataSource={[
                {
                  key: "1",
                  rank: 1,
                  course: "CS101 - Intro to Programming",
                  instructor: "Dr. Smith",
                  department: "Computer Science",
                  sei: 4.8,
                  clarity: 4.9,
                  engagement: 4.7,
                  methods: 4.8,
                  content: 4.7,
                  learning: 4.8,
                },
                {
                  key: "2",
                  rank: 2,
                  course: "MATH201 - Calculus II",
                  instructor: "Dr. Johnson",
                  department: "Mathematics",
                  sei: 4.7,
                  clarity: 4.6,
                  engagement: 4.7,
                  methods: 4.7,
                  content: 4.8,
                  learning: 4.6,
                },
                {
                  key: "3",
                  rank: 3,
                  course: "PHY301 - Quantum Physics",
                  instructor: "Dr. Brown",
                  department: "Physics",
                  sei: 4.6,
                  clarity: 4.5,
                  engagement: 4.6,
                  methods: 4.5,
                  content: 4.6,
                  learning: 4.7,
                },
                {
                  key: "4",
                  rank: 4,
                  course: "CHEM101 - General Chemistry",
                  instructor: "Dr. White",
                  department: "Chemistry",
                  sei: 4.5,
                  clarity: 4.4,
                  engagement: 4.5,
                  methods: 4.6,
                  content: 4.5,
                  learning: 4.5,
                },
                {
                  key: "5",
                  rank: 5,
                  course: "BIO201 - Cell Biology",
                  instructor: "Dr. Green",
                  department: "Biology",
                  sei: 4.4,
                  clarity: 4.3,
                  engagement: 4.4,
                  methods: 4.3,
                  content: 4.4,
                  learning: 4.3,
                },
              ]}
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {modalCourse && (
        <CourseDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          courseId={modalCourse.courseId}
          courseName={modalCourse.courseName}
          departmentName={modalCourse.departmentName}
        />
      )}
    </div>
  );
};

export default DeanDashboard;
