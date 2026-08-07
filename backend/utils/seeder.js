const mongoose = require('mongoose');
const Department = require('../models/Department');
const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const User = require('../models/User');

const seedData = async () => {
  try {
    const buildingCount = await Building.countDocuments();
    if (buildingCount > 0) {
      console.log('Database already has buildings. Skipping seeding...');
      return;
    }

    console.log('No buildings found. Starting database seeding...');

    // Define the colleges and their departments
    const colleges = {
      "D.Y. Patil Engineering A Wing": {
        floors: 3, // Ground + 2 floors
        classrooms: 15,
        labs: 10,
        departments: ["Computer Science", "Artificial Intelligence"]
      },
      "D.Y. Patil Engineering B Wing": {
        floors: 3,
        classrooms: 12,
        labs: 8,
        departments: ["Information Technology"]
      },
      "D.Y. Patil Engineering C Wing": {
        floors: 3,
        classrooms: 15,
        labs: 9,
        departments: ["Mechanical"]
      },
      "D.Y. Patil Engineering D Wing": {
        floors: 3,
        classrooms: 12,
        labs: 8,
        departments: ["Instrumentation"]
      },
      "D.Y. Patil Engineering E Wing": {
        floors: 3,
        classrooms: 10,
        labs: 7,
        departments: ["Civil"]
      },
      "D.Y. Patil Junior College": {
        floors: 3,
        classrooms: 20,
        labs: 7,
        departments: ["Science", "Commerce", "Arts"]
      },
      "D.Y. Patil International University": {
        floors: 6, // Ground + 5 floors
        classrooms: 30,
        labs: 15,
        departments: ["Computer Science", "Artificial Intelligence"]
      },
      "D.Y. Patil College of Architecture": {
        floors: 3,
        classrooms: 15,
        labs: 5,
        departments: ["Architecture"]
      }
    };

    // 1. Gather and seed all unique departments
    const deptNames = new Set();
    Object.values(colleges).forEach(c => {
      c.departments.forEach(d => deptNames.add(d));
    });

    const deptMap = {};
    for (const name of deptNames) {
      let dept = await Department.findOne({ name });
      if (!dept) {
        dept = await Department.create({ name });
      }
      deptMap[name] = dept;
    }

    // 2. Create buildings, floors, and rooms
    for (const [collegeName, collegeData] of Object.entries(colleges)) {
      const building = await Building.create({ name: collegeName });
      
      const depts = collegeData.departments.map(name => deptMap[name]);
      
      const classroomsPerFloor = Math.floor(collegeData.classrooms / collegeData.floors);
      const labsPerFloor = Math.floor(collegeData.labs / collegeData.floors);

      for (let fNum = 0; fNum < collegeData.floors; fNum++) {
        const floorName = fNum === 0 ? "Ground Floor" : `Floor ${fNum}`;
        const floor = await Floor.create({
          name: floorName,
          level: fNum,
          building: building._id
        });

        // Create classrooms
        for (let i = 0; i < classroomsPerFloor; i++) {
          const roomNumPad = String(i + 1).padStart(2, '0');
          const roomNumber = `${fNum}${roomNumPad}`;
          const dept = depts[i % depts.length];

          await Room.create({
            room_number: roomNumber,
            name: `Classroom ${roomNumber}`,
            room_type: 'classroom',
            floor: floor._id,
            department: dept._id
          });
        }

        // Create labs
        for (let i = 0; i < labsPerFloor; i++) {
          const roomNumPad = String(i + 1).padStart(2, '0');
          const roomNumber = `L${fNum}${roomNumPad}`;
          const dept = depts[i % depts.length];

          await Room.create({
            room_number: roomNumber,
            name: `Lab ${roomNumber}`,
            room_type: 'lab',
            floor: floor._id,
            department: dept._id
          });
        }
      }
    }

    console.log('Campus buildings, floors, and rooms seeded successfully.');

    // 3. Create test users
    const testUserExists = await User.findOne({ username: 'testuser' });
    if (!testUserExists) {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123', // Will be hashed automatically by user pre-save middleware
        user_type: 'student'
      });
      console.log('Test student user created: testuser / password123');
    }

    const testStaffExists = await User.findOne({ username: 'cleaning' });
    if (!testStaffExists) {
      await User.create({
        username: 'cleaning',
        email: 'cleaning@example.com',
        password: 'password123', // Will be hashed automatically by user pre-save middleware
        user_type: 'cleaning_staff'
      });
      console.log('Test cleaning staff user created: cleaning / password123');
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedData;
