# Assignment for Autodesk Forma

The task was to make a simple web application where the user can interact with a set of polygons on a map.

![alt text](output.png)

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

2. There is currently no way to revert to the original `FeatureCollection` without refreshing the page. A future improvement could introduce history/undo functionality.

3. The app assumes that all input GeoJSON files are valid `FeatureCollection` objects containing polygon geometries. No validation is performed at runtime.

4. All changes are stored in memory for the current session. Data is not persisted to disk, browser storage, or a backend. Reloading the page will reset all changes.

5. Switching between solutions does not flush changes, and each solution is stored separately.
