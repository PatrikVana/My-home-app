import jwt from "jsonwebtoken"; // Import jsonwebtoken, umožňuje ověření a dekódování jwt tokenu
import User from "../models/User.js"; // Import User model pro ověření zda user existuje, načtení rolí a oprávnění

// Middleware pro ověření tokenu
export const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Přístup zamítnut. Žádný token" });

  try {
    // ověření jwt tokenu na základě tajného klíče v .env souboru
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Načtení celého uživatele z databáze podle ID
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Uživatel nenalezen" });
    }

    req.user = user; // Přidání celého uživatele do req.user
    next();
  } catch (error) {
    res.status(400).json({ error: "Neplatný token" });
  }
};

// Middleware pro ověření role (use, superadmin, admin)
export const authorizeRole = (role) => {
  return async (req, res, next) => {
    try {
      // Načtení uživatele podle ID
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "Uživatel nenalezen" });
      }
      // kontrola zda má uživatel dostatečnou roli pro provedení akcí
      if (user.role !== role) {
        return res.status(403).json({ error: "Nedostatečná oprávnění" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Chyba při ověřování role" });
    }
  };
};
