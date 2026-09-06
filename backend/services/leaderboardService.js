const Department = require('../models/Department');
const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const WasteReport = require('../models/WasteReport');
const ApiError = require('../utils/ApiError');

/**
 * Define college groupings based on building name patterns
 * This maps building name patterns to college groupings
 * IMPORTANT: This is a configuration - if building names change, this needs updating
 */
const COLLEGE_GROUPINGS = {
  'D.Y. Patil College of Engineering': [
    'Engineering',
    'D.Y. Patil Engineering'
  ],
  'D.Y. Patil Junior College': [
    'Junior College'
  ],
  'D.Y. Patil International University': [
    'International'
  ],
  'D.Y. Patil College of Architecture': [
    'Architecture'
  ]
};

/**
 * Find which college group a building belongs to
 * @param {string} buildingName - Name of the building
 * @returns {string|null} College group name or null
 */
const getCollegeGroup = (buildingName) => {
  for (const [collegeGroup, patterns] of Object.entries(COLLEGE_GROUPINGS)) {
    for (const pattern of patterns) {
      if (buildingName.includes(pattern)) {
        return collegeGroup;
      }
    }
  }
  return null;
};

/**
 * Get leaderboard with department scores and college-wise breakdown
 * Uses MongoDB aggregation for better performance
 * @returns {Object} Leaderboard data
 */
const getLeaderboard = async () => {
  try {
    // 1. Overall Department Scores using aggregation
    const departmentStats = await WasteReport.aggregate([
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomData'
        }
      },
      {
        $unwind: {
          path: '$roomData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'roomData.department',
          foreignField: '_id',
          as: 'departmentData'
        }
      },
      {
        $unwind: {
          path: '$departmentData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$departmentData._id',
          name: { $first: '$departmentData.name' },
          report_count: { $sum: 1 }
        }
      },
      {
        $sort: { report_count: -1 }
      }
    ]);

    // Get all departments for those with 0 reports
    const allDepartments = await Department.find({});
    const departmentMap = new Map(departmentStats.map(d => [d._id?.toString(), d]));
    
    const overallScores = allDepartments.map(dept => {
      const stats = departmentMap.get(dept._id.toString());
      return {
        _id: dept._id,
        name: dept.name,
        report_count: stats ? stats.report_count : 0
      };
    });

    // Sort by report count descending
    overallScores.sort((a, b) => b.report_count - a.report_count);

    // 2. College Wise Breakdown using aggregation pipeline
    const collegeData = {};
    
    // Get all buildings and group them by college
    const allBuildings = await Building.find({});
    
    for (const building of allBuildings) {
      const collegeGroup = getCollegeGroup(building.name);
      if (!collegeGroup) continue;

      // Aggregate reports for this building's rooms
      const buildingStats = await WasteReport.aggregate([
        {
          $lookup: {
            from: 'rooms',
            localField: 'room',
            foreignField: '_id',
            as: 'roomData'
          }
        },
        {
          $unwind: {
            path: '$roomData',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'floors',
            localField: 'roomData.floor',
            foreignField: '_id',
            as: 'floorData'
          }
        },
        {
          $match: {
            'floorData.building': building._id
          }
        },
        {
          $lookup: {
            from: 'departments',
            localField: 'roomData.department',
            foreignField: '_id',
            as: 'departmentData'
          }
        },
        {
          $unwind: {
            path: '$departmentData',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$departmentData._id',
            name: { $first: '$departmentData.name' },
            report_count: { $sum: 1 }
          }
        }
      ]);

      // Merge into college data
      if (!collegeData[collegeGroup]) {
        collegeData[collegeGroup] = {};
      }

      for (const stat of buildingStats) {
        if (!stat._id) continue;
        const deptIdStr = stat._id.toString();
        
        if (!collegeData[collegeGroup][deptIdStr]) {
          collegeData[collegeGroup][deptIdStr] = {
            _id: stat._id,
            name: stat.name,
            report_count: 0
          };
        }
        collegeData[collegeGroup][deptIdStr].report_count += stat.report_count;
      }
    }

    // Sort departments within each college
    const sortedCollegeData = {};
    for (const [collegeName, deptMap] of Object.entries(collegeData)) {
      const sortedDepts = Object.values(deptMap);
      sortedDepts.sort((a, b) => b.report_count - a.report_count);
      sortedCollegeData[collegeName] = sortedDepts;
    }

    return {
      overall_scores: overallScores,
      college_data: sortedCollegeData
    };
  } catch (error) {
    console.error('Leaderboard service error:', error);
    throw ApiError.internal('Error fetching leaderboard data');
  }
};

module.exports = {
  getLeaderboard,
  getCollegeGroup,
  COLLEGE_GROUPINGS
};
