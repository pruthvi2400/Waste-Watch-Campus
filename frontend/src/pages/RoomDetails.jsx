import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useReports } from '../hooks/useReports';
import { useCampus } from '../hooks/useCampus';

import { getErrorMessage } from '../utils/errorHandler';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeft, School, AlertTriangle, CheckCircle, Clock, Trash2, Shield, Calendar, User as UserIcon } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();


  const { updateStatus } = useReports();
  const fetchRoomDetails = async () => {
    try {
      const res = await api.get(`/api/campus/rooms/${id}`);
      setRoom(res.data.room);
      setReports(res.data.reports);
    } catch (err) {
      // Error handled by hook
      // Error handled by hook
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const handleResolve = async (reportId) => {
    setUpdatingId(reportId);
    try {
      const result = await updateStatus(reportId, 'Resolved');
      if (result.success) {
        await fetchRoomDetails();
      } else {
        alert(result.error || 'Failed to update report status');
      }
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update report status'));
    } finally {
      setUpdatingId(null);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }


  // Analytics
  const wasteTypes = {};
  const severities = {};
  reports.forEach(r => {
    wasteTypes[r.waste_type] = (wasteTypes[r.waste_type] || 0) + 1;
    severities[r.severity] = (severities[r.severity] || 0) + 1;
  });

  const hasCritical = severities['Critical'] > 0;
  const hasHigh = severities['High'] > 0;
  const hasMedium = severities['Medium'] > 0;

  let recommendationText = 'Minimal intervention needed. Low level waste can be addressed during routine cleaning.';
  let recommendationClass = 'border-green-400 bg-green-50 text-green-800';
  let recommendationHeaderBg = 'bg-green-600';

  if (hasCritical) {
    recommendationText = 'Immediate action required. Critical waste issues need prompt attention from cleaning staff.';
    recommendationClass = 'border-red-400 bg-red-50 text-red-800';
    recommendationHeaderBg = 'bg-red-600';
  } else if (hasHigh) {
    recommendationText = 'Prompt action needed. High severity waste should be addressed within 24 hours.';
    recommendationClass = 'border-amber-400 bg-amber-50 text-amber-800';
    recommendationHeaderBg = 'bg-amber-500';
  } else if (hasMedium) {
    recommendationText = 'Regular cleanup needed. Schedule standard cleaning for this room.';
    recommendationClass = 'border-blue-400 bg-blue-50 text-blue-800';
    recommendationHeaderBg = 'bg-blue-600';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
        <Link to={`/building/${room.floor?.building?._id}`} className="hover:text-emerald-600 flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4" />
          <span>{room.floor?.building?.name}</span>
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{room.name}</span>
      </div>

      {/* Room Hero */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
            <Trash2 className="h-8 w-8 text-emerald-600" />
            <span>{room.name}</span>
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">{room.room_number}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {room.floor?.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {room.department?.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 capitalize">
              {room.room_type}
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          {user ? (
            <Link
              to={`/report/${room._id}`}
              className="inline-flex items-center space-x-1 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium transition-colors cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report Unattended Waste</span>
            </Link>
          ) : (
            <Link
              to={`/login?next=/report/${room._id}`}
              className="inline-flex items-center space-x-1 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium transition-colors"
            >
              <UserIcon className="h-4 w-4" />
              <span>Login to Report Waste</span>
            </Link>
          )}
        </div>
      </div>

      {/* Overview Analytics Card */}
      {reports.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-2 p-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              <span>Waste Summary Analysis</span>
            </h3>

            {/* Waste Types */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Waste Type Distribution</h4>
              <div className="flex flex-wrap gap-4">
                {Object.entries(wasteTypes).map(([type, val]) => (
                  <div key={type} className="flex items-center space-x-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm">
                    <span className={`w-3 h-3 rounded-full ${
                      type === 'Paper' ? 'bg-blue-500' :
                      type === 'Plastic' ? 'bg-cyan-500' :
                      type === 'E-waste' ? 'bg-red-500' :
                      type === 'Food waste' ? 'bg-green-500' :
                      type === 'Hazardous' ? 'bg-amber-500' : 'bg-gray-500'
                    }`}></span>
                    <span className="font-medium text-gray-700">{type}: {val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity Distribution */}
            <div>
              <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Severity Distribution</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(severities).map(([sev, val]) => (
                  <span key={sev} className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    sev === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                    sev === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    sev === 'Medium' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {sev}: {val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Alert Card */}
          <div className={`border-t md:border-t-0 md:border-l ${recommendationClass} p-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center space-x-2 font-bold text-lg mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Response Required</span>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                {recommendationText}
              </p>
            </div>
            <div className="text-xs text-gray-400 mt-4 border-t border-gray-200 pt-3">
              * Waste classification auto-analyzed by Google Gemini API.
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Unresolved Reports</h2>
      {reports.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
          <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
          <p className="text-lg font-bold text-gray-900">This room is perfectly clean!</p>
          <p className="text-sm text-gray-400 mt-1">No waste reports are currently pending.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-6 p-6"
            >
              {/* Report Images (Standard display) */}
              <div className="md:col-span-1">
                {report.images && report.images.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {report.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.startsWith('http') ? img : `/static/uploads/${img}`}
                        alt="Reported waste"
                        className="rounded-md h-36 w-full object-cover border border-gray-100 shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-36 bg-gray-100 border rounded-md flex items-center justify-center text-gray-400 text-sm">
                    No image uploaded
                  </div>
                )}
              </div>

              {/* Report Text Info */}
              <div className="md:col-span-3 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        report.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        report.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                        report.severity === 'Medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.severity}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        report.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 bg-gray-50 border border-gray-100 rounded p-3 leading-relaxed">
                    {report.description || 'No description provided.'}
                  </p>

                  <div className="text-xs text-gray-400 flex flex-wrap gap-y-1 gap-x-4">
                    <span className="flex items-center">
                      <UserIcon className="h-3.5 w-3.5 mr-1" />
                      Reported by: {report.user?.username || 'Anonymous'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Date: {new Date(report.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center capitalize">
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Type: {report.waste_type}
                    </span>
                  </div>
                </div>

                {/* Cleaning Staff Action Button */}
                {user?.user_type === 'cleaning_staff' && report.status !== 'Resolved' && (
                  <div className="mt-4 border-t border-gray-100 pt-4 flex justify-end">
                    <button
                      onClick={() => handleResolve(report._id)}
                      disabled={updatingId === report._id}
                      className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-sm disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{updatingId === report._id ? 'Resolving...' : 'Mark as Resolved'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
