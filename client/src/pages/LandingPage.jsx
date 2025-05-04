import { Link } from 'react-router-dom';
import "../styles/LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <header>
        <div className="landing-header">
          <ul className="landing-menu">
            <li>
              <Link to="/login" className='link'>
              <p className='landing-menu-button'>Přihlásit se</p>
              </Link>
            </li>
            <li>
              <Link to="/register" className='link'>
                <p className='landing-menu-button'>Registrovat se</p>
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <h1>Vítejte v naší aplikaci</h1>
      <p>Spravujte své úkoly efektivně a jednoduše!</p>
    </div>
  );
}

export default LandingPage;