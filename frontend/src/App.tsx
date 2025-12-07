import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import UploadPage from "@/pages/upload";
import BatchPage from "./pages/batch";


function App() {
  return (
    <Routes>
      <Route element={<BatchPage />} path="/" />
      <Route element={<IndexPage />} path="/crear" />
      <Route element={<UploadPage />} path="/upload" />
    </Routes>
  );
}

export default App;
