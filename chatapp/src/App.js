import './App.css';
import ChatRoom from './Components/ChatRoom/ChatRoom';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Navbar /> }, // Home route with Navbar
    { path: "/chat-room", element: <ChatRoom /> }, // ChatRoom route
  ]);
  return routes;
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
