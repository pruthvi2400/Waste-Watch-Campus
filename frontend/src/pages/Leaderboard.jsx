import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Trophy, Award, Landmark, GraduationCap, Map, UserPlus, HelpCircle } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [overallScores, setOverallScores] = useState([]);
  const [collegeData, setCollegeData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/api/leaderboard');
        setOverallScores(res.data.overall_scores);
        setCollegeData(res.data.college_data);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Intro Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-emerald-600 px-6 py-4 flex items-center space-x-2 text-white">
          <Trophy className="h-6 w-6 text-emerald-200" />
          <h1 className="text-xl font-bold">Campus Waste Management Leaderboard</h1>
        </div>
        <div className="p-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            This leaderboard recognizes the departments that are most active in reporting waste issues across the campus.
            Higher reporting indicates greater awareness and participation in keeping our campus clean.
          </p>
        </div>
      </div>

      {/* College-wise Rankings */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">College-wise Department Rankings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {Object.entries(collegeData).map(([collegeName, departments]) => {
          let cardBorderClass = 'border-emerald-200';
          let headerBgClass = 'bg-emerald-600 text-white';
          let CollegeIcon = Trophy;

          if (collegeName.includes('Engineering')) {
            cardBorderClass = 'border-blue-200';
            headerBgClass = 'bg-blue-600 text-white';
            CollegeIcon = Landmark;
          } else if (collegeName.includes('Junior College')) {
            cardBorderClass = 'border-green-200';
            headerBgClass = 'bg-green-600 text-white';
            CollegeIcon = GraduationCap;
          } else if (collegeName.includes('International')) {
            cardBorderClass = 'border-purple-200';
            headerBgClass = 'bg-purple-600 text-white';
            CollegeIcon = Trophy;
          } else if (collegeName.includes('Architecture')) {
            cardBorderClass = 'border-red-200';
            headerBgClass = 'bg-red-600 text-white';
            CollegeIcon = Award;
          }

          return (
            <div key={collegeName} className={`bg-white rounded-lg border ${cardBorderClass} shadow-sm overflow-hidden flex flex-col justify-between`}>
              <div>
                <div className={`px-6 py-4 flex items-center space-x-2 ${headerBgClass}`}>
                  <CollegeIcon className="h-5 w-5" />
                  <h3 className="font-bold text-lg">{collegeName}</h3>
                </div>
                
                <div className="p-6">
                  {departments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                          <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <th className="py-3 px-2">Rank</th>
                            <th className="py-3 px-2">Department</th>
                            <th className="py-3 px-2 text-right">Reports Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {departments.map((dept, index) => {
                            const isTopThree = index < 3;
                            const isFirst = index === 0;
                            const maxReports = departments[0].report_count || 1;
                            const percentage = (dept.report_count / maxReports) * 100;

                            return (
                              <tr
                                key={dept._id}
                                className={`text-sm ${
                                  isFirst ? 'bg-amber-50/50' :
                                  index === 1 ? 'bg-slate-50/50' :
                                  index === 2 ? 'bg-emerald-50/50' : ''
                                }`}
                              >
                                <td className="py-3.5 px-2">
                                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                                    isFirst ? 'bg-amber-100 text-amber-800' :
                                    index === 1 ? 'bg-slate-200 text-slate-800' :
                                    index === 2 ? 'bg-emerald-100 text-emerald-800' :
                                    'bg-gray-100 text-gray-500'
                                  }`}>
                                    {index + 1}
                                  </span>
                                </td>
                                <td className="py-3.5 px-2 font-semibold text-gray-800 flex items-center space-x-1">
                                  {isFirst && <Trophy className="h-4 w-4 text-amber-500 inline flex-shrink-0" />}
                                  <span>{dept.name}</span>
                                </td>
                                <td className="py-3.5 px-2 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden hidden sm:block">
                                      <div
                                        className={`h-full rounded-full ${
                                          collegeName.includes('Engineering') ? 'bg-blue-600' :
                                          collegeName.includes('Junior College') ? 'bg-green-600' :
                                          collegeName.includes('International') ? 'bg-purple-600' :
                                          'bg-emerald-600'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="font-bold text-gray-900">{dept.report_count}</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No department data available.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 text-xs text-gray-400 font-medium">
                {departments.length} departments contributing in this group
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation Callout */}
      <div className="bg-gray-900 text-white rounded-lg p-8 text-center shadow-md">
        <h3 className="text-xl font-bold flex items-center justify-center space-x-2 mb-3">
          <GraduationCap className="h-6 w-6 text-emerald-400" />
          <span>Join the Campus Sustainability Movement!</span>
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto mb-6 text-sm sm:text-base leading-relaxed">
          Every report counts! Help keep our campus clean and sustainable by actively reporting waste issues and encouraging others to participate.
        </p>
        {user ? (
          <Link
            to="/"
            className="inline-flex items-center space-x-1 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-sm transition-colors"
          >
            <Map className="h-4 w-4" />
            <span>Explore Campus Map</span>
          </Link>
        ) : (
          <Link
            to="/register"
            className="inline-flex items-center space-x-1 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-sm transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Register Now</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
