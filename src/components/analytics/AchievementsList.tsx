import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface Achievement {
  name: string;
  description: string;
  unlocked: boolean;
}

interface AchievementsListProps {
  achievements: Achievement[];
}

export default function AchievementsList({
  achievements,
}: AchievementsListProps) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Your Achievements
        </Typography>

        <List>
          {achievements.map((achievement: Achievement, index: number) => (
            <ListItem
              key={index}
              sx={{
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon>
                <EmojiEventsIcon
                  sx={{ color: 'warning.main', fontSize: 32 }}
                />
              </ListItemIcon>
              <ListItemText
                primary={achievement.name}
                secondary={achievement.description}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
              {achievement.unlocked && (
                <Chip
                  label="Unlocked"
                  color="success"
                  size="small"
                  icon={<EmojiEventsIcon />}
                />
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}