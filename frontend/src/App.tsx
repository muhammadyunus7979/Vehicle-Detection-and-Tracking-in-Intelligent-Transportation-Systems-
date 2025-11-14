import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./routes/Dashboard";
import { SettingsProvider } from "./context/SettingsContext";

const App = () => (
  <SettingsProvider>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </SettingsProvider>
);

export default App;


