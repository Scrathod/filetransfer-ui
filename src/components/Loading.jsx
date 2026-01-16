import { CircularProgress, Box } from '@mui/material';


export default function Loading() {
return (
<Box display="flex" justifyContent="center" padding={2}>
<CircularProgress />
</Box>
);
}