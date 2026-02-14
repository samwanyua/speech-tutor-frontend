import React from 'react';
import { Card, CardContent, Typography, SxProps, Theme } from '@mui/material';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconColor?: string;
  sx?: SxProps<Theme>;
}

export default function StatCard({
  icon,
  value,
  label,
  iconColor = 'primary.main',
  sx = {},
}: StatCardProps) {
  return (
    <Card elevation={2} sx={sx}>
      <CardContent sx={{ textAlign: 'center' }}>
        {React.cloneElement(icon as any, {
          sx: { fontSize: 40, color: iconColor, mb: 1 },
        })}
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}