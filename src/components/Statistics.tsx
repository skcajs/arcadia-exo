import { Box, List, ListItem, Divider, ListItemText } from "@mui/material";

export default function Statistics() {
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem className="title">
          <Box>Statistics</Box>
        </ListItem>
        <Divider />

        <ListItem>
          <ListItemText primary={"Area: xxx"} />
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
}
