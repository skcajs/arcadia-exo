import {
  Box,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";

export default function Solutions() {
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem className="title">
          <Box>Solution List</Box>
        </ListItem>
        <Divider />
        {["Solution 1", "Solution 2"].map((text) => (
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
