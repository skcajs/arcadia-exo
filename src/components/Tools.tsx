import {
  Box,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";

export default function Tools() {
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem className="title">
          <Box>Tools</Box>
        </ListItem>
        <Divider />
        {["Intersect", "Union"].map((text) => (
          <React.Fragment key={text}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
