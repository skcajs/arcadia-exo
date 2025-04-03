import { AppBar, Box, Drawer, Toolbar, Typography } from "@mui/material";
import "./AppLayout.css";
import Solutions from "./Solutions";
import Statistics from "./Statistics";
import Tools from "./Tools";
import Map from "./Map";

export default function AppLayout() {
  return (
    <>
      {/* app bar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className="toolbar">
          <Typography>
            <img src="./autodesk-forma.png" style={{ height: 24 }} />
          </Typography>
        </Toolbar>
      </AppBar>

      <Box>
        {/* map */}
        <Map />

        {/* left side bar */}
        <Drawer variant="permanent" anchor="left">
          <Toolbar />
          <Solutions />
        </Drawer>

        {/* right side bar */}
        <Drawer variant="permanent" anchor="right">
          <Toolbar />
          <Statistics />
          <br />
          <Tools />
        </Drawer>
      </Box>
    </>
  );
}
