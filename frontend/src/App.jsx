import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import SelectPersonType from "./pages/SelectPersonType";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyPhone from "./pages/VerifyPhone";

// Dashboards - REVISA QUE LAS CARPETAS SEAN EXACTAMENTE ASÍ:
import AdminDashboard from "./pages/admin/Dashboard"; // 'admin' en minúsculas según tu captura
import ClientDashboard from "./pages/Client/Dashboard"; // 'Client' con C mayúscula según tu captura

// Onboarding
import Onboarding from "./pages/Onboarding";
import LivenessCheck from "./pages/LivenessCheck";
import IneUpload from "./pages/IneUpload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-person-type" element={<SelectPersonType />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-phone" element={<VerifyPhone />} />

        {/* Dashboards */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/liveness" element={<LivenessCheck />} />
        <Route path="/onboarding/ine/upload" element={<IneUpload />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;