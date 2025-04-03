import { Box, List, ListItem, Divider, ListItemText } from "@mui/material";
import { useMapStore } from "../stores/mapStore";

export default function Statistics() {
  const area = useMapStore((state) => state.actions.getArea());

  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem className="title">
          <Box>Statistics</Box>
        </ListItem>
        <Divider />

        <ListItem>
          <ListItemText primary={`Area: ${area.toFixed(2)} m²`} />
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
}
