import React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function LoadingBar() {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <LinearProgress
        sx={{
          height: "10px",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "pink",
          },
        }}
      />
    </Box>
  );
}
