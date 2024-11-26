import React, { useEffect, useState } from "react";
import { AppProvider } from "./configs/AppContext";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
const Home = React.lazy(() => import("./pages/Home.jsx"));
const Register = React.lazy(() => import("./pages/Register.jsx"));
const Login = React.lazy(() => import("./pages/Login.jsx"));
const Navbar = React.lazy(() => import("./components/Navbar.jsx"));
const ErrorHandler = React.lazy(() => import("./components/ErrorHandler.jsx"));

function App() {
  const [user, setUser] = useState(null);
    const [err, setError] = useState(null);
    const video = React.useRef(null);

  const values = {
    user,
    setUser,
    err,
      setError,
        video,
  };

  useEffect(() => {
    if (err) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [err]);

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div>Loading...</div>}>
        <div className="App">
          <AppProvider values={values}>
            <ErrorHandler />
            <Navbar />
            <main id="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </main>
          </AppProvider>
        </div>
      </React.Suspense>
    </ErrorBoundary>
  );
}

export default App;
