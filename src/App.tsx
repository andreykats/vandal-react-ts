import { Route, Routes } from "react-router-dom"
import './App.css';
import { OpenAPI } from './client';

import GridView from './components/GridView';
import Layout from './components/Layout';
import Nopage from './components/Nopage';
import RowView from "./components/RowView";

OpenAPI.BASE = 'http://localhost:8000'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<GridView />} />
        <Route path="/history/" element={<RowView />} />
        {/* <Route path="/books/:id" element={<Book />} /> */}
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  )
}

export default App;