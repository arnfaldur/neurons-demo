import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";

export function LoadingState() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        my: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
}

export function ConnectionErrorState({ retry }: { retry?: () => void }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        my: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ef5350",
        borderRadius: 2,
      }}
    >
      <CloudOffOutlinedIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }} color="error">
        Connection Error
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
        Could not connect to the server. Please check your internet connection or try again later.
      </Typography>
      {retry && (
        <Button variant="contained" color="primary" onClick={retry}>
          Retry
        </Button>
      )}
    </Paper>
  );
}

export function DataFetchErrorState({ message, retry }: { message?: string, retry?: () => void }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        my: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ef5350",
        borderRadius: 2,
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }} color="error">
        Error Loading Data
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
        {message || "There was a problem loading the requested data."}
      </Typography>
      {retry && (
        <Button variant="contained" color="primary" onClick={retry}>
          Retry
        </Button>
      )}
    </Paper>
  );
}

export function EmptyDataState({ message }: { message?: string }) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 4,
        my: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <SearchOffOutlinedIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }} color="text.secondary">
        No Data Found
      </Typography>
      <Typography variant="body1" textAlign="center">
        {message || "No data is available for this request."}
      </Typography>
    </Paper>
  );
}