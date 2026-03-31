// 파일 경로: src/main.jsx
// ========================================
// 📌 감성여행2 홈페이지 진입 파일
// - React Router 연결
// - App 컴포넌트를 브라우저 루트에 연결
// ========================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);