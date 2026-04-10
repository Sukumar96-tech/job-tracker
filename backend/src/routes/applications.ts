import express, { Router, Response } from 'express';
import { AIService } from '../services/AIService.js';
import { ApplicationService } from '../services/ApplicationService.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Parse job description with AI
router.post('/parse', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { jobDescription } = req.body;

    if (!jobDescription) {
      res.status(400).json({ error: 'Job description required' });
      return;
    }

    const parsed = await AIService.parseJobDescription(jobDescription);
    res.status(200).json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to parse job description';
    res.status(500).json({ error: message });
  }
});

// Generate resume suggestions
router.post(
  '/suggestions',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { role, company, skills } = req.body;

      if (!role || !company || !skills) {
        res
          .status(400)
          .json({ error: 'Role, company, and skills required' });
        return;
      }

      const suggestions = await AIService.generateResumeSuggestions(
        role,
        company,
        skills
      );
      res.status(200).json({ suggestions });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to generate suggestions';
      res.status(500).json({ error: message });
    }
  }
);

// Get all applications for logged-in user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const applications = await ApplicationService.getApplicationsByUser(
      req.userId
    );
    res.status(200).json(applications);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch applications';
    res.status(500).json({ error: message });
  }
});

// Get single application
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const application = await ApplicationService.getApplicationById(
      req.params.id
    );

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    if (application.userId !== req.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.status(200).json(application);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch application';
    res.status(500).json({ error: message });
  }
});

// Create application
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const application = await ApplicationService.createApplication(
      req.userId,
      req.body
    );
    res.status(201).json(application);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create application';
    res.status(400).json({ error: message });
  }
});

// Update application
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const application = await ApplicationService.getApplicationById(
      req.params.id
    );

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    if (application.userId !== req.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updated = await ApplicationService.updateApplication(
      req.params.id,
      req.body
    );
    res.status(200).json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to update application';
    res.status(400).json({ error: message });
  }
});

// Delete application
router.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const application = await ApplicationService.getApplicationById(
        req.params.id
      );

      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      if (application.userId !== req.userId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      await ApplicationService.deleteApplication(req.params.id);
      res.status(200).json({ message: 'Application deleted' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete application';
      res.status(500).json({ error: message });
    }
  }
);

export default router;
