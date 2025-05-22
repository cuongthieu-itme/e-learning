'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface QuestionPerLectureData {
  lectureId: string;
  lectureTitle: string;
  questionCount: number;
}

interface CorrectAnswerData {
  answer: string;
  count: number;
}

interface QuestionMetricsProps {
  data: {
    questionsPerLecture: QuestionPerLectureData[];
    correctAnswerDistribution: CorrectAnswerData[];
  };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
const ANSWER_COLORS: Record<string, string> = {
  'A': '#3b82f6',
  'B': '#10b981',
  'C': '#f59e0b',
  'D': '#8b5cf6',
  'E': '#ef4444',
};

const QuestionMetrics: React.FC<QuestionMetricsProps> = ({ data }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Question Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Questions Per Lecture</h3>
          {data.questionsPerLecture.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No questions data available</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.questionsPerLecture}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis
                    dataKey="lectureTitle"
                    type="category"
                    width={80}
                    tick={props => {
                      const { x, y, payload } = props;
                      return (
                        <text x={x} y={y} dy={3} textAnchor="end" fill="#666" fontSize={12}>
                          {payload.value.length > 15 ? payload.value.substring(0, 15) + '...' : payload.value}
                        </text>
                      );
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} questions`, 'Count']}
                    labelFormatter={(label) => `Lecture: ${label}`}
                  />
                  <Bar dataKey="questionCount" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Correct Answer Distribution</h3>
          {data.correctAnswerDistribution.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No answer distribution data available</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.correctAnswerDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="answer"
                    label={({ answer, count }) => `${answer}: ${count}`}
                  >
                    {data.correctAnswerDistribution.map((entry) => (
                      <Cell
                        key={`cell-${entry.answer}`}
                        fill={ANSWER_COLORS[entry.answer] || COLORS[0]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} questions`, `Answer ${props.payload.answer}`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            Total Questions: <span className="font-bold">{getTotalQuestions(data.correctAnswerDistribution)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

function getTotalQuestions(distribution: CorrectAnswerData[]): number {
  return distribution.reduce((sum, item) => sum + item.count, 0);
}

export default QuestionMetrics;
