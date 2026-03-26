import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./Pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}