import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Set Login as the default root page */}
        <Route path="/" element={<Login />} />
        
        {/* Set Register as a separate route */}
        <Route path="/register" element={<Register />} />
        
        {/* Placeholder for when we build Feed */}
        {/* <Route path="/feed" element={<Feed />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;