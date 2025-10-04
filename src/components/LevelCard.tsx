import { Card, CardContent, CardActions, Button, Typography } from "@mui/material";
import Link from "next/link";


interface Props {
level: string;
description: string;
}


export default function LevelCard({ level, description }: Props) {
return (
<Card>
<CardContent>
<Typography variant="h6">{level.toUpperCase()}</Typography>
<Typography>{description}</Typography>
</CardContent>
<CardActions>
<Button component={Link} href={`/lessons/${level}`} size="small">Start</Button>
</CardActions>
</Card>
);
}