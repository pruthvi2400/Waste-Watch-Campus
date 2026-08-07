const Department = require('../models/Department');
const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const WasteReport = require('../models/WasteReport');

// @desc    Get leaderboard rankings
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    // 1. Overall Department Scores
    const departments = await Department.find({});
    const reports = await WasteReport.find({}).populate({
      path: 'room',
      populate: { path: 'department' }
    });

    const overallScores = departments.map(dept => {
      const count = reports.filter(r => r.room && r.room.department && r.room.department._id.toString() === dept._id.toString()).length;
      return {
        _id: dept._id,
        name: dept.name,
        report_count: count
      };
    });

    // Sort by report count descending
    overallScores.sort((a, b) => b.report_count - a.report_count);

    // 2. College Wise Breakdown
    const collegeGroups = {
      "D.Y. Patil College of Engineering": [],
      "D.Y. Patil Junior College": [],
      "D.Y. Patil International University": [],
      "D.Y. Patil College of Architecture": []
    };

    const allBuildings = await Building.find({});
    allBuildings.forEach(building => {
      if (building.name.includes('Engineering')) {
        collegeGroups["D.Y. Patil College of Engineering"].push(building._id);
      } else if (building.name.includes('Junior College')) {
        collegeGroups["D.Y. Patil Junior College"].push(building._id);
      } else if (building.name.includes('International')) {
        collegeGroups["D.Y. Patil International University"].push(building._id);
      } else if (building.name.includes('Architecture')) {
        collegeGroups["D.Y. Patil College of Architecture"].push(building._id);
      }
    });

    const collegeData = {};

    for (const [collegeName, buildingIds] of Object.entries(collegeGroups)) {
      if (buildingIds.length === 0) continue;

      // Find floors for these buildings
      const floors = await Floor.find({ building: { $in: buildingIds } });
      const floorIds = floors.map(f => f._id);

      // Find rooms for these floors
      const rooms = await Room.find({ floor: { $in: floorIds } }).populate('department');

      const deptDataMap = {};

      rooms.forEach(room => {
        if (!room.department) return;
        const deptIdStr = room.department._id.toString();

        if (!deptDataMap[deptIdStr]) {
          deptDataMap[deptIdStr] = {
            _id: room.department._id,
            name: room.department.name,
            report_count: 0
          };
        }

        // Count reports for this specific room
        const roomReportCount = reports.filter(r => r.room && r.room._id.toString() === room._id.toString()).length;
        deptDataMap[deptIdStr].report_count += roomReportCount;
      });

      const sortedDepts = Object.values(deptDataMap);
      sortedDepts.sort((a, b) => b.report_count - a.report_count);

      if (sortedDepts.length > 0) {
        collegeData[collegeName] = sortedDepts;
      }
    }

    res.json({
      overall_scores: overallScores,
      college_data: collegeData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
};

module.exports = { getLeaderboard };
