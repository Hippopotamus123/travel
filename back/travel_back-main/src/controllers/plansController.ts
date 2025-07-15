import { Request, Response } from 'express';
import Plan from '../models/Plan';

export const createPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      userId, 
      place, 
      duration, 
      name, 
      image,
      description,
      activities,
      attractions,
      foods,
      packing_list 
    } = req.body;

    if (!userId || !place || !duration) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const planData: any = {
      user: userId,
      place,
      duration,
      name: name || `My ${place} Plan`,
      image
    };

    if (description) planData.description = description;
    if (activities?.length) planData.activities = activities;
    if (attractions?.length) planData.attractions = attractions;
    if (foods?.length) planData.foods = foods;
    if (packing_list?.length) planData.packing_list = packing_list;

    const newPlan = await Plan.create(planData);
    res.status(201).json(newPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create plan', error });
  }
};

export const getPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;
    
    const filter = userId ? { user: userId } : {};
    const plans = await Plan.find(filter);

    if (!plans || plans.length === 0) {
      res.status(404).json({ message: 'No travel plans found' });
      return;
    }

    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Error fetching travel plans' });
  }
};

export const getPlanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error('Error fetching plan by ID:', error);
    res.status(500).json({ message: 'Error fetching plan' });
  }
};

