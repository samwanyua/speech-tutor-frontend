'use client';

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ accuracy, fluency }: { accuracy: number; fluency: number }) {
  const data = [
    { name: 'Accuracy', value: accuracy },
    { name: 'Fluency', value: fluency },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(6px)',
        mt: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Performance Overview
        </Typography>
        <ResponsiveContainer width="90%" height={200}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="value" fill="#4caf50" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
