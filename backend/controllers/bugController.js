import Bug from '../models/Bug.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { triageBug } from '../services/aiTriage.js';

export const getBugs = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    
    // Role-based filtering
    if (req.user.role === 'Tester') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'Developer') {
      query.assignedTo = req.user._id;
    } else if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    const bugs = await Bug.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single bug
export const getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    if (bug) {
      res.json(bug);
    } else {
      res.status(404).json({ message: 'Bug not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a bug (with AI triage)
export const createBug = async (req, res) => {
  try {
    const { title, description, stepsToReproduce, module, screenshotUrl } = req.body;
    
    // AI Triage
    const aiResult = triageBug(title, description);

    // Auto-assign developer based on category (simple round-robin or random logic)
    // Find a developer
    const devs = await User.find({ role: 'Developer' });
    let assignedDev = null;
    if (devs.length > 0) {
      // Just assign to the first dev for now, could be enhanced
      assignedDev = devs[Math.floor(Math.random() * devs.length)]._id;
    }

    const bug = new Bug({
      title,
      description,
      stepsToReproduce,
      module,
      screenshotUrl,
      createdBy: req.user._id,
      assignedTo: assignedDev,
      ...aiResult // includes severity, priority, category, confidenceScore
    });

    const createdBug = await bug.save();
    
    const populatedBug = await Bug.findById(createdBug._id).populate('assignedTo', 'name email');
    res.status(201).json(populatedBug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a bug (status, etc)
export const updateBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (bug) {
      if (req.user.role === 'Developer') {
        // Developers can only update status
        bug.status = req.body.status || bug.status;
      } else {
        // Admins can update everything
        bug.title = req.body.title || bug.title;
        bug.description = req.body.description || bug.description;
        bug.status = req.body.status || bug.status;
        bug.priority = req.body.priority || bug.priority;
        bug.severity = req.body.severity || bug.severity;
        bug.assignedTo = req.body.assignedTo || bug.assignedTo;
        bug.category = req.body.category || bug.category;
      }

      const updatedBug = await bug.save();
      const populatedBug = await Bug.findById(updatedBug._id).populate('assignedTo', 'name email');
      res.json(populatedBug);
    } else {
      res.status(404).json({ message: 'Bug not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment to bug
export const addComment = async (req, res) => {
  try {
    const { message } = req.body;
    const bugId = req.params.id;

    const comment = new Comment({
      bugId,
      userId: req.user._id,
      message
    });

    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'name email');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a bug
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ bugId: req.params.id }).populate('userId', 'name email').sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Analytics
export const getAnalytics = async (req, res) => {
  try {
    const bugsBySeverity = await Bug.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    const bugsByStatus = await Bug.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const bugsByCategory = await Bug.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      bugsBySeverity,
      bugsByStatus,
      bugsByCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
