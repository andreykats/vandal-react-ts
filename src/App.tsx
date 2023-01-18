import { Route, Routes } from "react-router-dom"
import './App.css';
import { OpenAPI } from './client';

import Layout from './Layout';
import Nopage from './components/Nopage';
import GridView from './components/GridView';
import HistoryView from "./components/HistoryView";
import ImageView from './components/ImageView';
import CanvasView from './components/CanvasView';

OpenAPI.BASE = 'http://localhost:8080'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<GridView />} />
        <Route path="/history/:id" element={<HistoryView />} />
        <Route path="/view/:id" element={<ImageView />} />
        <Route path="/edit/" element={<CanvasView />} />
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  )
}

export default App;