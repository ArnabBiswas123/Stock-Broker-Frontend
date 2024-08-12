import { Route, Routes } from "react-router-dom";
import './App.css';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MySidebar from "./common/Sidebar";


function App() {
  return (
    <>
       <Routes>
        <Route path="/" element={<LoginPage></LoginPage>}></Route>
        <Route path="/register" element={<SignupPage></SignupPage>}></Route>
        <Route path="/dashboard" element={<MySidebar></MySidebar>}></Route>
        <Route path="/stock/:ticker" element={<MySidebar></MySidebar>}></Route>
        <Route path="/wishlist" element={<MySidebar></MySidebar>}></Route>
      </Routes>
    </>
  );
}

export default App;
