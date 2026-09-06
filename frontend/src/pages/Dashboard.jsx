import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useReports } from '../hooks/useReports';
import { getErrorMessage } from '../utils/errorHandler';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle, AlertTriangle, Clock, Shield, Building, Filter, ArrowRight, User as UserIcon } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { reports, loading, error, fetchAllReports, updateStatus } = useReports();
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterBuilding, setFilterBuilding] = useState('All');
  const [resolvingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.user_type !== 'cleaning_staff') {
        navigate('/'); // Only cleaning staff can see this dashboard
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const handleResolve = async (reportId) => {
    setUpdatingId(reportId);
    try {
      const result = await updateStatus(reportId, 'Resolved');
      if (result.success) {
        await fetchAllReports();
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update report status'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Active (unresolved) reports
  const pendingReports = reports.filter(r => r.status !== 'Resolved');

  // Statistics
  const totalPending = pendingReports.length;
  const totalCritical = pendingReports.filter(r => r.severity === 'Critical').length;
  const totalHigh = pendingReports.filter(r => r.severity === 'High').length;
  const totalMedium = pendingReports.filter(r => r.severity === 'Medium').length;

  // Filter list of buildings dynamically
  const uniqueBuildings = Array.from(new Set(reports.map(r => r.room?.floor?.building?.name).filter(Boolean)));

  // Apply filters
  const filteredReports = pendingReports.filter(r => {
    const matchesSeverity = filterSeverity === 'All' || r.severity === filterSeverity;
    const matchesBuilding = filterBuilding === 'All' || r.room?.floor?.building?.name === filterBuilding;
    return matchesSeverity && matchesBuilding;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 mb-8 border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-400" />
            <span>Cleaning Staff Task Control Center</span>
          </h1>
          <p className="mt-1 text-slate-400">
            Welcome back, **{user?.username}**. Manage and resolve waste issues across campus wings in real-time.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center space-x-4">
          <Clock className="h-12 w-12 text-slate-500 bg-slate-50 p-2 rounded-full" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalPending}</p>
            <p className="text-sm font-semibold text-gray-400">Pending Cleanups</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center space-x-4">
          <AlertTriangle className="h-12 w-12 text-red-500 bg-red-50 p-2 rounded-full" />
          <div>
            <p className="text-2xl font-bold text-red-600">{totalCritical}</p>
            <p className="text-sm font-semibold text-gray-400">Critical Issues</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center space-x-4">
          <AlertTriangle className="h-12 w-12 text-amber-500 bg-amber-50 p-2 rounded-full" />
          <div>
            <p className="text-2xl font-bold text-amber-600">{totalHigh}</p>
            <p className="text-sm font-semibold text-gray-400">High Priority</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center space-x-4">
          <CheckCircle className="h-12 w-12 text-emerald-500 bg-emerald-50 p-2 rounded-full" />
          <div>
            <p className="text-2xl font-bold text-emerald-600">{reports.length - totalPending}</p>
            <p className="text-sm font-semibold text-gray-400">Resolved Today</p>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-700">
          <Filter className="h-5 w-5 text-emerald-600" />
          <span className="font-bold text-sm uppercase tracking-wider">Filter Tasks:</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Severity Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-bold uppercase">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:outline-none focus:ring-emerald-500 text-gray-900"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Building Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-bold uppercase">Building:</span>
            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:outline-none focus:ring-emerald-500 text-gray-900"
            >
              <option value="All">All Buildings</option>
              {uniqueBuildings.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center space-x-2">
        <span>Active Dispatch Sheet ({filteredReports.length})</span>
      </h2>

      {filteredReports.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-12 text-center text-gray-500 shadow-sm">
          <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
          <p className="text-lg font-bold text-gray-900">Great Job! All cleanups done.</p>
          <p className="text-sm text-gray-400 mt-1">There are no matching pending waste reports.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-white border border-gray-150 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              {/* Photo Preview */}
              <div className="flex-shrink-0">
                {report.images && report.images.length > 0 ? (
                  <img
                    src={report.images[0].startsWith('http') ? report.images[0] : `/static/uploads/${report.images[0]}`}
                    alt="reported-waste"
                    className="h-28 w-28 object-cover rounded-md border"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=300&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="h-28 w-28 bg-gray-50 border rounded-md flex items-center justify-center text-gray-400 text-xs">
                    No Photo
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                    report.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                    report.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                    report.severity === 'Medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.severity}
                  </span>
                  
                  <span className="inline-flex items-center text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded capitalize">
                    {report.waste_type}
                  </span>

                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <Building className="h-3 w-3 mr-1" />
                    {report.room?.floor?.building?.name} - {report.room?.floor?.name} - {report.room?.name}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{report.description || 'No description provided.'}</p>
                
                <div className="text-[11px] text-gray-400 mt-3 flex items-center space-x-2">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Reported by {report.user?.username || 'Anonymous'}</span>
                  <span>•</span>
                  <span>Date: {new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Resolution Button */}
              <div className="flex flex-col gap-2 justify-between items-end h-full self-stretch">
                <Link
                  to={`/room/${report.room?._id}`}
                  className="text-emerald-600 hover:text-emerald-700 font-bold text-sm inline-flex items-center space-x-1"
                >
                  <span>Go to Room</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  onClick={() => handleResolve(report._id)}
                  disabled={resolvingId === report._id}
                  className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-sm disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{resolvingId === report._id ? 'Resolving...' : 'Complete Task'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
