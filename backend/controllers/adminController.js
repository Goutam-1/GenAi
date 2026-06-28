import User from "../models/user.js";
import Conversation from "../models/conversation.js";

/**
 * GET /admin/dashboard
 * Returns total stats, date-filtered graph data, and user list.
 */
export const getDashboard = async (req, res) => {
  try {
    const { date } = req.query;

    let dateFilter = {};

    // If date is provided, filter that whole day
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      dateFilter = {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      };
    }

    // =========================
    // TOTAL STATS (ALL TIME)
    // =========================
    const totalUsers = await User.countDocuments();

    const totalImageRequests = await Conversation.countDocuments({
      featureType: "image",
    });

    const totalResumeAnalysis = await Conversation.countDocuments({
      featureType: "resume",
    });

    const totalTextChats = await Conversation.countDocuments({
      featureType: "text",
    });

    // =========================
    // GRAPH DATA (DATE FILTERED)
    // =========================
    const graphImageRequests = await Conversation.countDocuments({
      featureType: "image",
      ...dateFilter,
    });

    const graphResumeAnalysis = await Conversation.countDocuments({
      featureType: "resume",
      ...dateFilter,
    });

    const graphTextChats = await Conversation.countDocuments({
      featureType: "text",
      ...dateFilter,
    });

    // =========================
    // USERS
    // =========================
    const users = await User.find(
      {},
      {
        userId: 1,
        fullName: 1,
        email: 1,
        createdAt: 1,
      }
    ).sort({ userId: -1 });

    // =========================
    // RESPONSE
    // =========================
    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalImageRequests,
        totalResumeAnalysis,
        totalTextChats,
      },

      forGraph: {
        imageRequests: graphImageRequests,
        resumeAnalysis: graphResumeAnalysis,
        textChats: graphTextChats,
      },

      users,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};
