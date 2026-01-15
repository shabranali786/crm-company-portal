import { Suspense, useState } from "react";
import "./main.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Master from "./components/layout/Master";
import { Dashboard } from "./pages/Allpages";

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full size-12 border-b-2 border-primary/60"></div>
  </div>
);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <Suspense fallback={<PageLoader />}>
            <Master />
          </Suspense>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
    )
  );
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
