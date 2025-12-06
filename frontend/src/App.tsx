import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import UploadPage from "@/pages/upload";


function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<UploadPage />} path="/upload" />
    </Routes>
  );
}

export default App;
