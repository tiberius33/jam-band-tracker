import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Music, List, Search, Plus, X } from 'lucide-react';

const JamBandTracker = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [location, setLocation] = useState('San Francisco, CA');
  const [searchRadius, setSearchRadius] = useState(50);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [attendedShows, setAttendedShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Popular jam bands to track
  const jamBands = [
    'Goose', 'Dead & Company', 'Phish', 'Widespread Panic', 
    'Umphrey\'s McGee', 'String Cheese Incident', 'Tedeschi Trucks Band',
    'Trey Anastasio Band', 'JRAD', 'Billy Strings', 'Pigeons Playing Ping Pong'
  ];

  // Load attended shows from storage
  useEffect(() => {
    loadAttendedShows();
  }, []);

  const loadAttendedShows = async () => {
    try {
      const result = await window.storage.get('attended-shows');
      if (result && result.value) {
        setAttendedShows(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No previous shows found');
    }
  };

  const saveAttendedShows = async (shows) => {
    try {
      await window.storage.set('attended-shows', JSON.stringify(shows));
      setAttendedShows(shows);
    } catch (error) {
      console.error('Error saving shows:', error);
    }
  };

  // Search for upcoming shows near location
  const searchShows = async () => {
    setLoading(true);
    try {
      // For demo purposes, creating mock data
      // In production, you'd integrate with Setlist.fm API or similar
      const mockShows = [
        {
          id: '1',
          artist: 'Goose',
          venue: 'The Fillmore',
          city: 'San Francisco, CA',
          date: '2026-02-15',
          distance: 2,
          tourName: 'Winter Tour 2026'
        },
        {
          id: '2',
          artist: 'Billy Strings',
          venue: 'Golden Gate Park',
          city: 'San Francisco, CA',
          date: '2026-03-01',
          distance: 3,
          tourName: 'Spring Festival'
        },
        {
          id: '3',
          artist: 'Phish',
          venue: 'Shoreline Amphitheatre',
          city: 'Mountain View, CA',
          date: '2026-03-20',
          distance: 35,
          tourName: 'Spring Tour'
        },
        {
          id: '4',
          artist: 'JRAD',
          venue: 'The Independent',
          city: 'San Francisco, CA',
          date: '2026-02-28',
          distance: 1,
          tourName: 'West Coast Run'
        }
      ].filter(show => show.distance <= searchRadius);

      setUpcomingShows(mockShows);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark show as attended and add setlist
  const markAsAttended = (show) => {
    setSelectedShow(show);
    setShowModal(true);
  };

  const saveAttendedShow = (showData) => {
    const newShow = {
      ...showData,
      attendedDate: new Date().toISOString(),
      id: `attended-${Date.now()}`
    };
    
    const updated = [...attendedShows, newShow];
    saveAttendedShows(updated);
    setShowModal(false);
    setSelectedShow(null);
  };

  const removeAttendedShow = (showId) => {
    const updated = attendedShows.filter(show => show.id !== showId);
    saveAttendedShows(updated);
  };

  const SetlistModal = ({ show, onClose, onSave }) => {
    const [setlist, setSetlist] = useState('');
    const [notes, setNotes] = useState('');
    const [rating, setRating] = useState(5);

    const handleSave = () => {
      onSave({
        ...show,
        setlist: setlist.split('\n').filter(s => s.trim()),
        notes,
        rating
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{show.artist}</h3>
                <p className="text-gray-600">{show.venue} - {show.date}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setlist (one song per line)
                </label>
                <textarea
                  value={setlist}
                  onChange={(e) => setSetlist(e.target.value)}
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Arcadia&#10;Hot Tea&#10;Hungersite&#10;Rockdale&#10;..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Epic Hungersite jam, incredible light show..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save Show
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DiscoverTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Find Shows Near You</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, State or ZIP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius: {searchRadius} miles
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={searchShows}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Searching...' : 'Search Shows'}
          </button>
        </div>
      </div>

      {upcomingShows.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Upcoming Shows ({upcomingShows.length})
          </h3>
          
          <div className="space-y-3">
            {upcomingShows.map((show) => (
              <div key={show.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{show.artist}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{show.venue}, {show.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(show.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      {show.tourName && (
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          <span>{show.tourName}</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {show.distance} miles away
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => markAsAttended(show)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Attended
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && upcomingShows.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Click "Search Shows" to find jam bands near you</p>
        </div>
      )}
    </div>
  );

  const HistoryTab = () => {
    const stats = {
      total: attendedShows.length,
      artists: [...new Set(attendedShows.map(s => s.artist))].length,
      avgRating: attendedShows.length > 0 
        ? (attendedShows.reduce((sum, s) => sum + (s.rating || 0), 0) / attendedShows.length).toFixed(1)
        : 0
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Shows Attended</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.artists}</div>
            <div className="text-sm text-gray-600 mt-1">Different Artists</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.avgRating}</div>
            <div className="text-sm text-gray-600 mt-1">Avg Rating</div>
          </div>
        </div>

        {attendedShows.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Shows</h3>
            
            <div className="space-y-4">
              {attendedShows.sort((a, b) => new Date(b.date) - new Date(a.date)).map((show) => (
                <div key={show.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{show.artist}</h4>
                      <p className="text-sm text-gray-600">{show.venue}, {show.city}</p>
                      <p className="text-sm text-gray-500">{show.date}</p>
                      {show.rating && (
                        <div className="mt-1">
                          <span className="text-sm font-medium text-yellow-600">
                            ★ {show.rating}/10
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeAttendedShow(show.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {show.setlist && show.setlist.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <List className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Setlist</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {show.setlist.map((song, idx) => (
                          <div key={idx}>{idx + 1}. {song}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {show.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600 italic">{show.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No shows logged yet</p>
            <p className="text-sm text-gray-400 mt-2">Start by discovering shows and marking them as attended</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Jam Band Tracker</h1>
          <p className="text-gray-600">Find shows near you and track your concert history</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'discover'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Discover Shows
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                My Shows ({attendedShows.length})
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'discover' ? <DiscoverTab /> : <HistoryTab />}

        {showModal && selectedShow && (
          <SetlistModal
            show={selectedShow}
            onClose={() => {
              setShowModal(false);
              setSelectedShow(null);
            }}
            onSave={saveAttendedShow}
          />
        )}
      </div>
    </div>
  );
};

export default JamBandTracker;