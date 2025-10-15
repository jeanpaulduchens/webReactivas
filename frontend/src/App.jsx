import { useState } from 'react'
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Services from "./pages/Services";
import './style.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main>
          <Services />
        </main>
      </div>
    </div>
  );
}

export default App
