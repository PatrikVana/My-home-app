import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
// toast = funkce pro vytvoření notifikace, ToastContainer = komponenta pro zobrazení notifikace
import { toast, ToastContainer } from "react-toastify";
// redux akce k odstranění notifikace ze stavu po zavření toastu(notifikace)
import { removeNotification } from "../store/notifications/notificationsSlice";
// Zod schema, pro validaci struktůry notifikace
import { notificationSchema } from "../validation/schemas"; 
// načtení CSS pro vzhled notifikace
import "react-toastify/dist/ReactToastify.css";

const NotificationDisplay = () => {

  const dispatch = useDispatch();
  //načtení redux seznamu aktuáních notifikací
  const notifications = useSelector((state) => state.notifications);
  // uložení množiny iD notifikací do proměné, useRef zabrání re-renderování a vytvoření nové množiny (umožní kontrolu id, aby se toast nezobrazil vícekrát)
  const displayed = useRef(new Set());
  // useEffect, spustí se při změně notifications nebo dispatch
  useEffect(() => {
    notifications.forEach((note) => {
      // Validace Zod Schématu (notificationSchema) pomocí funkce safeParse(vrací objekt { success: true/false, data/error })
      const result = notificationSchema.safeParse(note);
      if (!result.success) {
        console.warn("Neplatná notifikace", result.error);
        return;
      }
      // separace úšpěšné odpovědí na id, zprávu a typ
      const { id, message, type } = result.data;
      // kontrola typu, pokud je obsažen v poli = načtení do proměné, pokud ne nastavení na default
      const toastType = ["info", "success", "warning", "error"].includes(type) ? type : "default";
      // kontrola zda toast s id už nebyl zobrazen
      if (!displayed.current.has(id)) {
        // přidání id do displayed.current
        displayed.current.add(id);
        // vytváření toastu podle typu
        toast[toastType](message, {
          // nastavení pozice okna notifikace
          position: "top-right",
          // natavení autoClose po 1.5 sekundy
          autoClose: 1500,
          onClose: () => {
            // odstranění id z z redux storu
            dispatch(removeNotification(id));
            // odstranění id z displayed.current
            displayed.current.delete(id);
          },
        });
      }
    });
  }, [notifications, dispatch]);
  // vrácení TostContaineru, zobrazuje všechny notifikace v aplikaci
  return <ToastContainer />;
};

export default NotificationDisplay;
