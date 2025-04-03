import React, { useEffect, useState } from "react";

import {
  Box,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { Solution } from "../types/Solution";
import { useMapActions } from "../stores/mapStore";

export default function Solutions() {
  const [data, setData] = useState([]);

  const { setSolutionMap } = useMapActions();

  useEffect(() => {
    const fetchSoltuions = async () => {
      const res = await fetch("/data/stubbs/solutions.json");

      if (!res.ok) return;

      const files = await res.json();

      setData(files);
    };

    fetchSoltuions();
  }, []);

  const handleGeojson = async (solution: Solution) => {
    const res = await fetch(`/data/geojson/${solution.fileName}`);
    if (!res.ok) return;

    const featureMap = await res.json();

    setSolutionMap({
      solutionName: solution.solutionName,
      collection: featureMap,
    });
  };

  return (
    <Box sx={{ width: 250 }} role="menu">
      <List>
        <ListItem className="title">
          <Box>Solution List</Box>
        </ListItem>
        <Divider />
        {data.map((item: Solution) => (
          <React.Fragment key={item.solutionName}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleGeojson(item)}>
                <ListItemText primary={item.solutionName} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
