import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import TodoList from "./pages/TodoList";
import FitnessTracker from "./pages/FitnessTracker";
import HabitBuilder from "./pages/HabitBuilder";
import PersonalFinance from "./pages/PersonalFinance";
import StudentPortal from "./pages/StudentPortal";
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
          <Route path="/habits" element={<HabitBuilder />} />
          <Route path="/finance" element={<PersonalFinance />} />
          <Route path="/student" element={<StudentPortal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
