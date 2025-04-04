import { AppBar, Box, Drawer, Toolbar, Typography } from "@mui/material";
import "./AppLayout.css";
import Solutions from "./Solutions";
import Statistics from "./Statistics";
import Tools from "./Tools";
import Map from "./Map";
import MapSwitch from "./MapSwitch";
import { useState } from "react";
import { useMapActions } from "../stores/mapStore";

export default function AppLayout() {
  const [isDark, setIsDark] = useState(false);

  const { setMode } = useMapActions();

  const handleLight = () => {
    setIsDark(!isDark);
    setMode(isDark ? "light" : "dark");
  };

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
          <Box sx={{ position: "absolute", bottom: 16, width: "100%" }}>
            <MapSwitch checked={isDark} onChange={handleLight} />
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
