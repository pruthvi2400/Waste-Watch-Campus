import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Building, DoorOpen, FlaskConical, GraduationCap, MapPin, MousePointer, Camera, ShieldCheck } from 'lucide-react';

const Home = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await api.get('/api/campus/buildings');
        setBuildings(res.data);
      } catch (err) {
        console.error('Error fetching buildings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Intro Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
          <MapPin className="h-8 w-8 text-emerald-600" />
          <span>D.Y. Patil Campus Waste Management Map</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Welcome to the Campus Waste Management System. Navigate through buildings, report waste, and help keep our campus clean.
        </p>

        {/* Dummy credentials info */}
        <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-3 rounded text-amber-800 text-sm">
          <span>Dummy login credentials: <strong>Username:</strong> testuser | <strong>Password:</strong> password123</span>
        </div>

        {/* Key Statistics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 flex items-center space-x-4">
            <Building className="h-12 w-12 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm font-medium text-emerald-700">Campus Buildings</p>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 flex items-center space-x-4">
            <DoorOpen className="h-12 w-12 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">130+</p>
              <p className="text-sm font-medium text-blue-700">Classrooms</p>
            </div>
          </div>

          <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 flex items-center space-x-4">
            <FlaskConical className="h-12 w-12 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">70+</p>
              <p className="text-sm font-medium text-purple-700">Laboratories</p>
            </div>
          </div>

          <div className="bg-amber-50 p-5 rounded-lg border border-amber-100 flex items-center space-x-4">
            <GraduationCap className="h-12 w-12 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">11</p>
              <p className="text-sm font-medium text-amber-700">Departments</p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-emerald-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5" />
            <span>How to Use the System</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <MousePointer className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">1. Select a Building</h4>
                <p className="text-sm text-gray-500 mt-1">Click on any building from the list below to explore its layout.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DoorOpen className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">2. Choose a Room</h4>
                <p className="text-sm text-gray-500 mt-1">Navigate through building floors and select a specific classroom or lab.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Camera className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">3. Report Waste</h4>
                <p className="text-sm text-gray-500 mt-1">Upload images of unattended waste and let Gemini AI classify the hazard levels.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Building List Section */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Explore Campus Buildings</h2>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {buildings.map((building) => (
            <div
              key={building._id}
              className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 p-6 flex flex-col justify-between items-center text-center group"
            >
              <div className="bg-emerald-100 text-emerald-600 rounded-full p-4 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Building className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{building.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Explore floors and rooms in this campus wing.
              </p>
              <Link
                to={`/building/${building._id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Explore Building
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
