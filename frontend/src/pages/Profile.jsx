import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Trash } from 'lucide-react';
import api from '../api/axios';

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [fetchingReports, setFetchingReports] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserReports = async () => {
      if (user) {
        try {
          // Since the waste report API is not created yet, we handle error gracefully
          const res = await api.get('/api/reports/my-reports');
          setReports(res.data);
        } catch (err) {
          console.log('Waste reports API not implemented yet or failed.');
        } finally {
          setFetchingReports(false);
        }
      }
    };

    fetchUserReports();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-8">
        <div className="bg-emerald-600 h-32"></div>
        <div className="px-6 py-6 relative">
          <div className="absolute -top-16 left-6 bg-white p-2 rounded-full shadow-md">
            <div className="bg-emerald-100 text-emerald-600 rounded-full h-24 w-24 flex items-center justify-center">
              <User className="h-12 w-12" />
            </div>
          </div>
          
          <div className="pl-32">
            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-500 flex items-center mt-1">
              <Shield className="h-4 w-4 mr-1 text-emerald-500" />
              <span className="capitalize">{user.user_type.replace('_', ' ')}</span>
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-gray-400">Member Since</p>
                <p className="font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Trash className="h-5 w-5 text-emerald-500" />
          <span>My Waste Reports</span>
        </h2>

        {fetchingReports ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-lg">
            <Trash className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-lg font-medium">No waste reports submitted yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Navigate to campus rooms to submit a report of unattended waste.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reports list will go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
