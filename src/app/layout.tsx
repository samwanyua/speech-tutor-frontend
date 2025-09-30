"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import MuiGlobalStyles from "@mui/material/GlobalStyles";
import { ReactNode } from "react";
import { poppins } from "./fonts"; 
import Navbar from "@/components/Navbar";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: poppins.fontFamily,
  },
});

const url = "/images/bg-1.png"; 

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* Global custom styles */}
          <MuiGlobalStyles
            styles={{
              html: {
                fontFamily: poppins.fontFamily,
                fontWeight: poppins.fontWeights?.[400] ?? 400,
              },
              "&::-webkit-scrollbar": {
                display: "none",
              },
              body: {
                margin: 0,
                background: `radial-gradient(at 47% 33%, hsl(268.36, 100%, 89%) 0, transparent 59%), 
                radial-gradient(at 82% 65%, hsl(300, 100%, 96%) 0, transparent 55%)`,
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
              },
            }}
          />
          <Navbar />
          <div style={{ marginTop: 60 }}>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
