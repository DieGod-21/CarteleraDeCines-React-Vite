import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './index.css';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Aplica la clase al <body> para que TODO herede el tema
  useEffect(() => {
    const clsDark = 'theme-dark';
    const clsLight = 'theme-light';
    document.body.classList.remove(clsDark, clsLight);
    document.body.classList.add(darkMode ? clsDark : clsLight);
  }, [darkMode]);

  return (
    <>
      <Navbar darkMode={darkMode} toggleTheme={() => setDarkMode((v) => !v)} />
      {/* Ancho completo + alto mínimo pantalla */}
      <main className="container-fluid min-vh-100 py-4">
        {/* Un padding lateral suave para respirar */}
        <div className="px-4">
          <Home />
        </div>
      </main>
    </>
  );
}
