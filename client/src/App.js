import { Routes, Route} from 'react-router-dom';
import Login from "./Login";
import Home from "./Home";
import './style.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/google" element={<Login />} />
        </Routes>
    );
}

export default App;
