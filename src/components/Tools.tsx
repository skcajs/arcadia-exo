import {
  Box,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import React from "react";
import { getStateLength, useMapActions, useVersion } from "../stores/mapStore";
import { Redo, Undo } from "@mui/icons-material";

export default function Tools() {
  const { intersect, union, undo, redo } = useMapActions();
  const version = useVersion();

  const tools = [
    { name: "Intersect", onClick: intersect },
    { name: "Union", onClick: union },
  ];

  return (
    <Box sx={{ width: 250 }} role="menu">
      <List>
        <ListItem className="title">
          <Box>Tools</Box>
        </ListItem>
        <Divider />
        {tools.map((tool) => (
          <React.Fragment key={tool.name}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => tool.onClick?.()}>
                <ListItemText primary={tool.name} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
        <ListItem>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <IconButton
              disabled={version !== undefined && version == 0}
              aria-label="add"
              size="large"
              onClick={() => undo()}
            >
              <Undo fontSize="inherit" />
            </IconButton>
            <div className="spacer" />
            <IconButton
              disabled={version !== undefined && version == getStateLength()}
              aria-label="add"
              size="large"
              onClick={() => redo()}
            >
              <Redo fontSize="inherit" />
            </IconButton>
          </Box>
        </ListItem>
      </List>
    </Box>
  );
}
