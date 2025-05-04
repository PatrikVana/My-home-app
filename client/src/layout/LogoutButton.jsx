// react router hook pro přesměrování uživatele
import { useNavigate } from "react-router-dom";
// hook pro funkci dispatch, k odeslání redux akce
import { useDispatch } from "react-redux";
// redux akce pro odhlášení uživatele
import { logoutUser } from "../store/auth/authSlice";
// ikona odhlášení z FontAwesome
import { FaSignOutAlt } from "react-icons/fa";

// komponenta přijímá "collapsed" jako props, popisuje zda je menu sbalené nebo rozbalené (sbalené = zobrazení ikony bez textu)
const LogoutButton = ({ collapsed }) => {
  // vyvolá redux akce
  const dispatch = useDispatch();
 // přesměruje uživatele na jinou stránku
  const navigate = useNavigate();
  // funkce pro odhlášení uživatele, spuštění logoutUser() zreduxu a přesměrování na stránku s přihlášením
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login"); 
  };

  return (
    // po kliknutí na tlačítko se spustí funkce handleLogout
    <button className="logout-btn" onClick={handleLogout}>
      {/*Zobrazrní ikony*/}
      <FaSignOutAlt />
      
      {// pokud není collapsed false zobrazí se i element span s textem "Odhlásit se"
        !collapsed && <span>Odhlásit se</span>
      }
    </button>
  );
};

export default LogoutButton;