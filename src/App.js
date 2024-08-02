import { Route, Routes } from "react-router-dom";
import './App.css';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
       <Routes>
        <Route path="/" element={<LoginPage></LoginPage>}></Route>
        <Route path="/register" element={<SignupPage></SignupPage>}></Route>
      </Routes>
    </>
  );
}

export default App;
