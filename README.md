# Assignment for Autodesk Forma

The task was to make a simple web application where the user can interact with a set of polygons on a map.

![alt text](<Screenshot from 2025-04-04 12-05-19.png>)

The application supports several features, including:

- Selecting from multiple solutions via the left-hand panel.
- Interacting with polygons from the loaded FeatureCollection.
- Performing boolean operations (union and intersect) on two selected polygons.
- When an operation is executed, the result replaces the selected polygons in the current FeatureCollection.

## Project Setup

The application is built with React and TypeScript, and uses several external libraries to support development:

- Leaflet.js for rendering the map and displaying polygons.

- Turf.js for performing geometric operations like intersection and union.

- Zustand for state management, with useState used for local component state where appropriate.

The global store is modular, relying on hooks to expose only the necessary actions and state.

### To run the application locally:

```bash
npm install
npm run dev
```

## Assumptions (and excuses)

There are multiple assumptions made:

1. Since the tools can only work with 2 polygons, at most, only 2 polygons can be selected. In the code, I have limited the selection to 2, if the user selects a third, it will not be selected until the user deselects another polygon.

2. When using the tool, currently, there is no option to go back to the original featurecollection without resetting the page. In a later version, there could be a history setting.

3. The application assumes valid GeoJSON, there is currently no validation on the GeoJSON object.

4. Persisting any changes are all done in memory. Normally, you can persist them to a database/ the cloud, a disk, or the users browser session (e.g, as a cookie or local session). Resetting the browser will flush any changes.

5. Switching between solutions does not flush changes, and each solution is stored separately.
