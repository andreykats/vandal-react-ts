import { Route, Routes } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import { OpenAPI } from './client';
import { API_URL } from './constants';

import Layout from './Layout';
import NotFound from './NotFound';
import GridView from './components/GridView';
import HistoryView from "./components/HistoryView";
import ImageView from './components/ImageView';
import CanvasView from './components/CanvasView';
import Login from "./Login";
import Account from "./Account";

OpenAPI.BASE = API_URL
OpenAPI.TOKEN = localStorage.getItem('token') || ""

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<GridView />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/account/" element={<Account />} />
        <Route path="/history/:id" element={<HistoryView />} />
        <Route path="/view/:id" element={<ImageView />} />
        <Route path="/edit/" element={<CanvasView />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App;