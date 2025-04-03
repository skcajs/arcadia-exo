import {
  Box,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import { useMapActions } from "../stores/mapStore";

export default function Tools() {
  const { intersect } = useMapActions();
  const { union } = useMapActions();

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
      </List>
    </Box>
  );
}
