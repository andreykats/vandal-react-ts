import { Route, Routes } from "react-router-dom"
import './App.css';
import { OpenAPI } from './client';
import { API_URL } from './constants';

import Layout from './Layout';
import NotFound from './NotFound';
import GridView from './components/GridView';
import HistoryView from "./components/HistoryView";
import ImageView from './components/ImageView';
import CanvasView from './components/CanvasView';

OpenAPI.BASE = API_URL

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<GridView />} />
        <Route path="/history/:id" element={<HistoryView />} />
        <Route path="/view/:id" element={<ImageView />} />
        <Route path="/edit/" element={<CanvasView />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App;