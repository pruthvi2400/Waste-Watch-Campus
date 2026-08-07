import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, AlertTriangle, Image as ImageIcon, Camera, Trash, AlertCircle, Loader } from 'lucide-react';

const Report = () => {
  const { room_id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Unknown');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/api/campus/rooms/${room_id}`);
        setRoom(res.data.room);
      } catch (err) {
        console.error('Error fetching room:', err);
      } finally {
        setRoomLoading(false);
      }
    };

    fetchRoom();
  }, [room_id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!title) {
      setError('Title is required');
      setIsSubmitting(false);
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least 1 image of the waste');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('severity', severity);
    
    images.forEach(img => {
      formData.append('images', img);
    });

    try {
      await api.post(`/api/reports/room/${room_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/room/${room_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (roomLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-500">
        Room not found!
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
        <Link to={`/room/${room_id}`} className="hover:text-emerald-600 flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4" />
          <span>{room.name}</span>
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Report Waste</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-amber-500 px-6 py-4 flex items-center space-x-2 text-white">
          <AlertTriangle className="h-6 w-6" />
          <h1 className="text-xl font-bold">Report Unattended Waste</h1>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 border border-gray-150 rounded-lg p-4 mb-6 flex items-center space-x-4">
            <div className="bg-emerald-100 text-emerald-600 rounded-full p-3">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{room.name} ({room.room_number})</h3>
              <p className="text-xs text-gray-500">
                {room.floor?.building?.name} - {room.floor?.name}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Please provide as much detail as possible and upload at least one clear photo of the waste.
            Our **Google Gemini AI** will automatically analyze the first photo to classify the waste type (Paper, Plastic, Hazardous, etc.) and recommend responses.
          </p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded flex items-start space-x-2 text-red-700 text-sm mb-6">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Form Details */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Report Title <span className="text-danger">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-900"
                    placeholder="e.g., Plastic bottles left near whiteboard"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-900"
                    placeholder="Describe the nature of the waste and exact location in the room..."
                  />
                </div>

                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                    Severity Level <span className="text-danger">*</span>
                  </label>
                  <select
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-900"
                  >
                    <option value="Unknown">Auto-Assess with Gemini AI</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <span className="text-xs text-gray-400 mt-1 block">
                    You can let our AI assess the severity level based on the image, or choose manually.
                  </span>
                </div>
              </div>

              {/* Right Column: Image Upload */}
              <div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">Upload Photos</h4>
                  <p className="text-xs text-gray-400 mb-4">
                    Upload up to 5 photos (at least 1 required). AI will analyze the **first image**.
                  </p>
                  
                  <input
                    type="file"
                    id="image-uploader"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-uploader"
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Choose Files
                  </label>
                </div>

                {/* Previews Grid */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group border rounded overflow-hidden shadow-sm h-24">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            AI Target
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-150 pt-4 flex justify-end space-x-3">
              <Link
                to={`/room/${room_id}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center items-center space-x-2 px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin h-4 w-4" />
                    <span>Gemini is classifying...</span>
                  </>
                ) : (
                  <span>Submit Waste Report</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
