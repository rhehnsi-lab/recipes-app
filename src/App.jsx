import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
// ↓ כאן כל אחת מוסיפה את ה־import שלה ↓
function Home (){
  return(
    <div>
      <h1>התחברות</h1>
   
    <nav>
      <Link to="/login/controlled">Controlled Form</Link>
      <Link to="/login/uncontrolled">Uncontrolled Form</Link>
      <Link to="/login/rhf">React Hook Form (RHF)</Link>
    </nav>
    <main>
      <Outlet />
    </main>
    </div>
    
  )
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* ↓ כאן כל אחת מוסיפה את ה־Route שלה ↓ */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
