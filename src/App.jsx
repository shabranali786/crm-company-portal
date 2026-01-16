import { Suspense, useState, useEffect } from "react";
import "./main.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Master from "./components/layout/Master";
import { Dashboard } from "./pages/Allpages";
import LoginForm from "./components/auth/LoginForm";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import { initializeTheme } from './store/slices/themeSlice';
import { initializeAuth } from './store/slices/authSlice';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full size-12 border-b-2 border-primary/60"></div>
  </div>
);

// App wrapper component to initialize theme and auth
const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(initializeTheme());
    dispatch(initializeAuth());
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Suspense fallback={<PageLoader />}>
                <Master />
              </Suspense>
            ) : (
              <LoginForm />
            )
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
