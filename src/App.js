import Eject from './utils/eject/eject';
import { Helmet } from 'react-helmet-async';
import './App.css';
function App() {
  return (
    <>
      <Helmet>
        <title>Bauth - Auth</title>
        <meta name="description" content="Secure authentication system built with React." />
        <link rel="canonical" href="https://joinshivam-bauth.vercel.app/" />
      </Helmet>

      <div className="App bg-[var(--theme)] text-[var(--gray-800)]">
        <Eject />
      </div>
    </>

  );
}

export default App;
