import { Route, Routes } from "react-router-dom";
import './App.css';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MySidebar from "./common/Sidebar";
import ForgetPassword from "./pages/ForgetPassword";
import EmailOtp from "./pages/EmailOtp";
import LoginAdminPage from "./pages/Admin/LoginAdminPage";
import AdminSidebar from "./common/Admin/AdminSidebar";




function App() {
  return (
    <>
       <Routes>
        <Route path="/" element={<LoginPage></LoginPage>}></Route>
        <Route path="/register" element={<SignupPage></SignupPage>}></Route>
        <Route path="/dashboard" element={<MySidebar></MySidebar>}></Route>
        <Route path="/stock/:ticker" element={<MySidebar></MySidebar>}></Route>
        <Route path="/wishlist" element={<MySidebar></MySidebar>}></Route>
        <Route path="/prediction" element={<MySidebar></MySidebar>}></Route>
        <Route path="/companyprediction/:name" element={<MySidebar></MySidebar>}></Route>
        <Route path="/profile" element={<MySidebar></MySidebar>}></Route>
        <Route path="/balence" element={<MySidebar></MySidebar>}></Route>
        <Route path="/history" element={<MySidebar></MySidebar>}></Route>
        <Route path="/purchase" element={<MySidebar></MySidebar>}></Route>
        <Route path="/contactus" element={<MySidebar></MySidebar>}></Route>
        <Route path="/forgetpassword" element={<ForgetPassword></ForgetPassword>}></Route>
        <Route path="/emailotp" element={<EmailOtp></EmailOtp>}></Route>
        <Route path="/admin/login" element={<LoginAdminPage></LoginAdminPage>}></Route>
        <Route path="/admin/logs" element={<AdminSidebar></AdminSidebar>}></Route>
        <Route path="/admin/stock/:ticker" element={<AdminSidebar></AdminSidebar>}></Route>
      </Routes>
    </>
  );
}

export default App;


