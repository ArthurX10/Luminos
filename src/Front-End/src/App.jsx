import Rotes from "./Rotes";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const savedSize = localStorage.getItem('text-size') || 'MÉDIO';
    const normalizedSize = savedSize.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    document.documentElement.setAttribute('data-text-size', normalizedSize);

    const reduceAnims = localStorage.getItem('reduce-animations') === 'true';
    document.documentElement.setAttribute('data-reduce-animations', reduceAnims.toString());
  }, []);



  return (
    <>
      <Rotes/>
    </>
  )
}

export default App;
