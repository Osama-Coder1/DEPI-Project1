import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import TodoList from "./pages/TodoList";
import FitnessTracker from "./pages/FitnessTracker";
import PersonalFinance from "./pages/PersonalFinance";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/fitness" element={<FitnessTracker />} />
          <Route path="/finance" element={<PersonalFinance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}