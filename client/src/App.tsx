import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import React from 'react';
import {io} from "socket.io-client";

import {QueryClient, QueryClientProvider} from 'react-query';

import {Login, Register, Home} from "pages";
import {useAuth} from "./contexts/Auth/AuthContext";
import {useSettingsChanger} from "./hooks";

const queryClient: QueryClient = new QueryClient();
export const socket: any = io("http://localhost:3001");

function App(): JSX.Element {
  const {user}  = useAuth();
  const {color_theme} = useSettingsChanger();

  return (
      <QueryClientProvider client={queryClient}>
          <div className={color_theme}>
              <Router>
                  <Routes>
                      <Route path="/" element={user ? <Home socket={socket}/> : <Register />} />
                      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                  </Routes>
              </Router>
          </div>
      </QueryClientProvider>
  );
}

export default App;
