"use client";

import { STORAGE, useLocalStorageStore } from "@/store";
import { useCommonStore } from "@/store/commonStore";
import {
  Button,
  Container,
  Grid,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { useShallow } from "zustand/react/shallow";
import AddCircle from "@mui/icons-material/AddCircle";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";

const theme = createTheme({
  palette: {
    primary: {
      main: "#205B96",
      light: "#E7EDF4",
    },
    secondary: {
      main: "#31363F",
    },
    success: {
      main: "#799351",
    },
    warning: {
      main: "#FFC83E",
    },
  },
});

export default function Template({ children }: PropsWithChildren) {
  const { user, logout, isAdmin } = useCommonStore(
    useShallow((state) => state)
  );
  const { push } = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Grid
          container
          sx={{
            padding: "12px 24px",
            background: theme.palette.primary.light,
            marginTop: "8px",
            borderRadius: "16px",
          }}
          gap={1}
          justifyContent="space-between"
          flexDirection={"row"}
        >
          <Grid item>
            <Button onClick={() => push("/")}>
              <MapsHomeWorkIcon htmlColor={theme.palette.secondary.main} />
            </Button>
          </Grid>
          <Grid container gap={1} width={"fit-content"}>
            {user ? (
              <>
                {isAdmin && (
                  <Grid item>
                    <Button
                      variant="text"
                      onClick={() => push("/admin/collections")}
                    >
                      Admin panel
                    </Button>
                  </Grid>
                )}
                <Grid item>
                  <Button
                    variant="text"
                    onClick={() => push("/user/collections")}
                  >
                    My collections
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="text"
                    onClick={() => push("/create-collection")}
                  >
                    <Grid container alignItems={"center"} gap={1}>
                      <Grid item>Create collection</Grid>
                      <AddCircle />
                    </Grid>
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={logout}>
                    Log Out
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <Button variant="outlined" onClick={() => push("/login")}>
                    Log In
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => push("/registration")}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        {children}
      </Container>
    </ThemeProvider>
  );
}
