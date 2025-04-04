import { Box, List, ListItem, Divider, ListItemText } from "@mui/material";
import { useArea } from "../stores/mapStore";

export default function Statistics() {
  const area = useArea();

  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem className="title">
          <Box>Statistics</Box>
        </ListItem>
        <Divider />

        <ListItem>
          <Box sx={{ fontStyle: "italic", color: "grey.700" }}>
            <ListItemText primary={`Area: ${area.toFixed(2)} m²`} />
          </Box>
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
}
