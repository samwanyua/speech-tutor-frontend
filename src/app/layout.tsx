"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import MuiGlobalStyles from "@mui/material/GlobalStyles";
import { ReactNode } from "react";
import { poppins } from "./fonts";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#000" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: poppins.fontFamily,
  },
});

const url = "/images/bg-1.png";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <MuiGlobalStyles
            styles={{
              "html, body, #__next": {
                height: "100%",
                width: "100%",
                margin: 0,
                padding: 0,
                overflowX: "hidden",
                fontFamily: poppins.fontFamily,
                fontWeight: poppins.fontWeights?.[400] ?? 400,
              },
              "&::-webkit-scrollbar": {
                display: "none",
              },
              body: {
                backgroundImage: `
                  radial-gradient(at 47% 33%, hsl(268.36, 100%, 89%) 0, transparent 59%),
                  radial-gradient(at 82% 65%, hsl(300, 100%, 96%) 0, transparent 55%),
                  url(${url})
                `,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
                minHeight: "100vh",
                color: "#222",
              },
            }}
          />

          <AuthProvider>
            <Navbar />
            {/* Main app content */}
            <main style={{ marginTop: 30 }}>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
