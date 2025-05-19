import User from '../models/User.js';
import { registrationSchema, loginSchema } from "../validation/userValidation.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  sendRegistrationEmail
} from "../services/emailService.js";

// Registrace uživatele
export const registerUser = async (req, res) => {

  const { error } = registrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, email, password, gender } = req.body;

  try {
    if (!username || !email || !password) {
      console.log("Chybí povinné pole!", { username, email, password });
      return res.status(400).json({ message: 'Všechna pole jsou povinná!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      gender: gender || null, 
      role: "user",
      approved: false,
      active: true,
    });

    await newUser.save();

    res.status(201).json({ message: 'Registrace proběhla úspěšně!' });

    await sendRegistrationEmail(newUser.email);
  } catch (error) {
    res.status(500).json({ error: 'Interní chyba serveru' });
  }
};

// Přihlášení uživatele
export const loginUser = async (req, res) => {

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // Přihlášení pomocí username a password
  const { username, password } = req.body;

  try {
    // Hledání uživatele podle username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Neplatné přihlašovací jméno' });
    }

    if (!user.approved) {
      return res.status(403).json({ message: 'Účet nebyl schválen administrátorem' });
    }

    // Blokace přihlášení, pokud je účet pozastavený (active: false)
    if (!user.active) {
      return res.status(403).json({ message: "Účet byl pozastaven. Kontaktujte správce." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Neplatné přihlašovací heslo' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      role: user.role,
      permissions: user.permissions
    });
  } catch (error) {
    res.status(500).json({ error: 'Interní chyba serveru' });
  }
};

// Získání dat přihlášeného uživatele
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Uživatel nenalezen" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Chyba při načítání uživatele" });
  }
};

