import { Routes, Route, Outlet } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoginControlled from "./pages/login/LoginControl";
import LoginUncontrolled from "./pages/login/LoginUncontrolled";
import LoginRhf from "./pages/login/LoginRhf";
// ↓ כאן כל אחת מוסיפה את ה־import שלה ↓

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login">
          <Route path="controlled" element={<LoginControlled />} />
          <Route path="uncontrolled" element={<LoginUncontrolled />} />
          <Route path="rhf" element={<LoginRhf />} />
        </Route>
        {/* ↓ כאן כל אחת מוסיפה את ה־Route שלה ↓ */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}