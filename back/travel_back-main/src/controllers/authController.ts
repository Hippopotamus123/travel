import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Inscription
export const signup = async (req: Request, res: Response) :Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: 'Email already in use' });
       return;
    }

    // Créer un nouvel utilisateur
    const user = new User({ name, email, password });
    await user.save();

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Connexion
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
       res.status(400).json({ message: 'Invalid credentials' });
       return;
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
       res.status(400).json({ message: 'Invalid credentials' });
       return;
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};