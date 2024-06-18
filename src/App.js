import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Error from "./Pages/Error";
import Main from "./Pages/Main";
import Login from "./Pages/Login";
import InfoPage from "./Pages/Info";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/*" element={<Error />} />
            <Route path="/login" element={<Login />} />
            <Route path="/info" element={<InfoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
