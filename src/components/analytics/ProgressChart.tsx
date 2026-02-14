import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendData {
  date: string;
  pronunciation_score: number;
  success_rate: number;
}

interface ProgressChartProps {
  data: TrendData[];
  title?: string;
}

export default function ProgressChart({
  data,
  title = '30-Day Progress Trend',
}: ProgressChartProps) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="pronunciation_score"
              stroke="#8884d8"
              name="Pronunciation Score"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="success_rate"
              stroke="#82ca9d"
              name="Success Rate"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}