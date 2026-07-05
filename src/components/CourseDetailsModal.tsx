import React, { useState, useEffect } from "react";
import { Modal, Tabs, Descriptions, List, Statistic, Select, DatePicker, Row, Col, Spin, Typography } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs, { Dayjs } from "dayjs";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const dimensionOptions = [
  { label: "Clarity & Organization", value: "Clarity & Organization" },
  { label: "Student Engagement", value: "Student Engagement" },
  { label: "Pedagogical Methods & Activities", value: "Pedagogical Methods & Activities" },
  { label: "Content Delivery & Subject Mastery", value: "Content Delivery & Subject Mastery" },
  { label: "Perceived Learning Impact", value: "Perceived Learning Impact" },
];

const timeframeOptions = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

// Dummy data for demonstration
const dummyOverview = {
  courseName: "CS101 - Intro to Programming",
  courseCode: "CS101",
  departments: ["Computer Science", "Mathematics"],
  lecturers: ["Dr. Smith", "Dr. Ada"],
  totalEnrollment: 120,
  avgSEI: 4.32,
  responseRate: 0.82,
};

// Helper to generate dummy SEI trend data
function generateSEITrend(timeframe, date) {
  const trend = [];
  if (timeframe === "weekly") {
    // 7 days in a week
    const base = dayjs(date || undefined).startOf("week");
    for (let i = 0; i < 7; i++) {
      trend.push({
        label: base.add(i, "day").format("ddd"),
        sei: 3.8 + Math.random() * 1.2,
      });
    }
  } else if (timeframe === "monthly") {
    // 4 weeks in a month
    for (let i = 1; i <= 4; i++) {
      trend.push({
        label: `Week ${i}`,
        sei: 3.8 + Math.random() * 1.2,
      });
    }
  } else if (timeframe === "yearly") {
    // 12 months in a year
    for (let i = 0; i < 12; i++) {
      trend.push({
        label: dayjs().month(i).format("MMM"),
        sei: 3.8 + Math.random() * 1.2,
      });
    }
  }
  return trend;
}

// Helper to generate dummy metrics for SEI
function getSEIMetrics(trend) {
  const avgSEI = trend.reduce((sum, d) => sum + d.sei, 0) / trend.length;
  return {
    avgSEI: Number(avgSEI.toFixed(2)),
    sessionCount: trend.length * 2 + Math.floor(Math.random() * 5),
    responseRate: 0.7 + Math.random() * 0.2,
  };
}

// Helper to generate dummy dimension trend data
function generateDimensionTrend(dimension, timeframe, date) {
  const trend = [];
  if (timeframe === "weekly") {
    const base = dayjs(date || undefined).startOf("week");
    for (let i = 0; i < 7; i++) {
      trend.push({
        label: base.add(i, "day").format("ddd"),
        score: 3.5 + Math.random() * 1.5,
      });
    }
  } else if (timeframe === "monthly") {
    for (let i = 1; i <= 4; i++) {
      trend.push({
        label: `Week ${i}`,
        score: 3.5 + Math.random() * 1.5,
      });
    }
  } else if (timeframe === "yearly") {
    for (let i = 0; i < 12; i++) {
      trend.push({
        label: dayjs().month(i).format("MMM"),
        score: 3.5 + Math.random() * 1.5,
      });
    }
  }
  return trend;
}

function getDimensionMetrics(trend) {
  const avgScore = trend.reduce((sum, d) => sum + d.score, 0) / trend.length;
  return {
    avgScore: Number(avgScore.toFixed(2)),
    facultyAvg: 3.8 + Math.random() * 0.7,
  };
}

const CourseDetailsModal = ({ visible, onClose, courseId, courseName, departmentName }) => {
  // State for Overview
  const [overview, setOverview] = useState(dummyOverview);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // State for SEI Trend
  const [seiTrend, setSeiTrend] = useState([]);
  const [seiTrendLoading, setSeiTrendLoading] = useState(false);
  const [seiTimeframe, setSeiTimeframe] = useState("monthly");
  const [seiDate, setSeiDate] = useState(dayjs());
  const [seiMetrics, setSeiMetrics] = useState(null);

  // State for Dimension Trend
  const [dimension, setDimension] = useState(dimensionOptions[0].value);
  const [dimensionTrend, setDimensionTrend] = useState([]);
  const [dimensionTrendLoading, setDimensionTrendLoading] = useState(false);
  const [dimensionTimeframe, setDimensionTimeframe] = useState("monthly");
  const [dimensionDate, setDimensionDate] = useState(dayjs());
  const [dimensionMetrics, setDimensionMetrics] = useState(null);

  // Simulate loading and update dummy data for SEI Trend
  useEffect(() => {
    if (!visible) return;
    setSeiTrendLoading(true);
    setTimeout(() => {
      const trend = generateSEITrend(seiTimeframe, seiDate);
      setSeiTrend(trend);
      setSeiMetrics(getSEIMetrics(trend));
      setSeiTrendLoading(false);
    }, 400);
  }, [visible, seiTimeframe, seiDate]);

  // Simulate loading and update dummy data for Dimension Trend
  useEffect(() => {
    if (!visible) return;
    setDimensionTrendLoading(true);
    setTimeout(() => {
      const trend = generateDimensionTrend(dimension, dimensionTimeframe, dimensionDate);
      setDimensionTrend(trend);
      setDimensionMetrics(getDimensionMetrics(trend));
      setDimensionTrendLoading(false);
    }, 400);
  }, [visible, dimension, dimensionTimeframe, dimensionDate]);

  // DatePicker mode for SEI Trend
  const getDatePickerProps = (timeframe) => {
    if (timeframe === "daily") return { picker: "week" as const };
    if (timeframe === "weekly") return { picker: "month" as const };
    if (timeframe === "monthly") return { picker: "year" as const };
    return {};
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={<span style={{ fontWeight: 600 }}>{courseName} Details</span>}
      width={800}
      footer={null}
      destroyOnClose
    >
      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview" key="overview">
          {overviewLoading ? (
            <Spin />
          ) : overview ? (
            <div>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Course Name">{overview.courseName}</Descriptions.Item>
                <Descriptions.Item label="Course Code">{overview.courseCode}</Descriptions.Item>
                <Descriptions.Item label="Department(s)">{overview.departments?.join(", ")}</Descriptions.Item>
                <Descriptions.Item label="Lecturers">
                  <List
                    size="small"
                    dataSource={overview.lecturers as string[]}
                    renderItem={(item: string) => <List.Item>{item}</List.Item>}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Total Student Enrollment">{overview.totalEnrollment}</Descriptions.Item>
                <Descriptions.Item label="Average SEI">
                  <Statistic value={overview.avgSEI} precision={2} />
                </Descriptions.Item>
                <Descriptions.Item label="Overall Response Rate">
                  <Statistic value={overview.responseRate * 100} precision={1} suffix="%" />
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : (
            <Text type="secondary">No data available.</Text>
          )}
        </TabPane>
        <TabPane tab="SEI Trend" key="sei-trend">
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Select
                value={seiTimeframe}
                onChange={setSeiTimeframe}
                options={timeframeOptions}
                style={{ width: 120 }}
              />
            </Col>
            <Col>
              <DatePicker
                value={seiDate}
                onChange={(date) => setSeiDate(date)}
                {...getDatePickerProps(seiTimeframe)}
              />
            </Col>
          </Row>
          {seiTrendLoading ? (
            <Spin />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={seiTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="sei" stroke="#1E40AF" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          )}
          {seiMetrics && (
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col><Statistic title="Avg SEI" value={seiMetrics.avgSEI} precision={2} /></Col>
              <Col><Statistic title="Sessions Evaluated" value={seiMetrics.sessionCount} /></Col>
              <Col><Statistic title="Response Rate" value={seiMetrics.responseRate * 100} precision={1} suffix="%" /></Col>
            </Row>
          )}
        </TabPane>
        <TabPane tab="Dimension Trends" key="dimension-trends">
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Select
                value={dimension}
                onChange={setDimension}
                options={dimensionOptions}
                style={{ width: 220 }}
              />
            </Col>
            <Col>
              <Select
                value={dimensionTimeframe}
                onChange={setDimensionTimeframe}
                options={timeframeOptions}
                style={{ width: 120 }}
              />
            </Col>
            <Col>
              <DatePicker
                value={dimensionDate}
                onChange={(date) => setDimensionDate(date)}
                {...getDatePickerProps(dimensionTimeframe)}
              />
            </Col>
          </Row>
          {dimensionTrendLoading ? (
            <Spin />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dimensionTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          )}
          {dimensionMetrics && (
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col><Statistic title="Avg Score" value={dimensionMetrics.avgScore} precision={2} /></Col>
              {dimensionMetrics.facultyAvg !== undefined && (
                <Col><Statistic title="Faculty Avg" value={dimensionMetrics.facultyAvg} precision={2} /></Col>
              )}
            </Row>
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default CourseDetailsModal; 