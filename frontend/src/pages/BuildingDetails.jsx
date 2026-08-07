import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Building, Layers, DoorOpen, FlaskConical, Info, AlertTriangle, ArrowLeft } from 'lucide-react';

const BuildingDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState('classroom'); // 'classroom' or 'lab'

  useEffect(() => {
    const fetchBuildingDetails = async () => {
      try {
        const res = await api.get(`/api/campus/buildings/${id}`);
        setBuilding(res.data);
      } catch (err) {
        console.error('Error fetching building details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-500">
        Building not found!
      </div>
    );
  }

  const currentFloor = building.floors[selectedFloorIdx];
  const roomsOnFloor = currentFloor ? currentFloor.rooms.filter(r => r.room_type === selectedRoomType) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-emerald-600 flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Campus Map</span>
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{building.name}</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
          <Building className="h-8 w-8 text-emerald-600" />
          <span>{building.name}</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Explore floors and rooms to view reported waste or submit a new waste report in this wing.
        </p>
      </div>

      {/* Floor Tab Controls */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {building.floors.map((floor, idx) => (
            <button
              key={floor._id}
              onClick={() => {
                setSelectedFloorIdx(idx);
                // Reset sub-room tab to classrooms
                setSelectedRoomType('classroom');
              }}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer
                ${selectedFloorIdx === idx
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <span className="flex items-center space-x-1">
                <Layers className="h-4 w-4" />
                <span>{floor.name}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      {currentFloor ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>{currentFloor.name} Management</span>
          </h2>

          {/* Sub-Tabs: Classrooms / Labs */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSelectedRoomType('classroom')}
              className={`
                flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer
                ${selectedRoomType === 'classroom'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}
              `}
            >
              <DoorOpen className="h-4 w-4" />
              <span>Classrooms</span>
            </button>
            <button
              onClick={() => setSelectedRoomType('lab')}
              className={`
                flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer
                ${selectedRoomType === 'lab'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}
              `}
            >
              <FlaskConical className="h-4 w-4" />
              <span>Laboratories</span>
            </button>
          </div>

          {/* Rooms Grid */}
          {roomsOnFloor.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roomsOnFloor.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {room.room_number}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wide">
                      Dept: {room.department?.name || 'General'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Link
                      to={`/room/${room._id}`}
                      className="inline-flex justify-center items-center space-x-1 px-3 py-2 border border-emerald-500 rounded-md text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <Info className="h-4 w-4" />
                      <span>Details</span>
                    </Link>
                    {user ? (
                      <Link
                        to={`/report/${room._id}`}
                        className="inline-flex justify-center items-center space-x-1 px-3 py-2 border border-amber-500 rounded-md text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span>Report</span>
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="inline-flex justify-center items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
                        title="Login to report waste"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span>Report</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 text-center text-emerald-800">
              No {selectedRoomType}s found on this floor.
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">No floor selected.</div>
      )}
    </div>
  );
};

export default BuildingDetails;
