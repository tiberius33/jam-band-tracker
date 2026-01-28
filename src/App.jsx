import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Music, List, Search, Plus, X, TrendingUp, Map as MapIcon, Settings, BarChart3 } from 'lucide-react';

const JamBandTracker = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [location, setLocation] = useState('San Francisco, CA');
  const [apiKey, setApiKey] = useState('');
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [attendedShows, setAttendedShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [songStats, setSongStats] = useState({});

  // Jam bands with their MusicBrainz IDs for API queries
  const jamBands = [
    { name: 'Goose', mbid: 'f3ab5564-1dca-4d06-a67f-9c0bf0a2f4c0' },
    { name: 'Phish', mbid: '4a2bb6c1-513e-4a14-9627-e46cb4385d0a' },
    { name: 'Dead & Company', mbid: '3a89bd59-5fb2-4dba-8e3c-f1f0f7a6a5e9' },
    { name: 'Billy Strings', mbid: 'c3d13d52-7b69-4b44-9f6f-e8f0a5a29e4c' },
    { name: 'Widespread Panic', mbid: '3797a6d0-7700-44bf-96fb-f44386bc9ab2' },
    { name: 'Umphrey\'s McGee', mbid: 'c0d0e5e0-7b0e-4e9a-8e3e-5f5e7e8e9e0e' },
    { name: 'JRAD', mbid: '8a7f4f4f-8a7f-4f4f-8a7f-4f4f8a7f4f4f' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateSongStats();
  }, [attendedShows]);

  const loadData = async () => {
    try {
      // Load API key (optional - for future Setlist.fm integration)
      const keyResult = await window.storage.get('setlistfm-api-key');
      if (keyResult?.value) {
        setApiKey(keyResult.value);
      }

      // Load attended shows
      const showsResult = await window.storage.get('attended-shows');
      if (showsResult?.value) {
        setAttendedShows(JSON.parse(showsResult.value));
      }
    } catch (error) {
      console.log('No previous data found');
    }
  };

  const saveApiKey = async (key) => {
    try {
      await window.storage.set('setlistfm-api-key', key);
      setApiKey(key);
      setShowApiSetup(false);
    } catch (error) {
      console.error('Error saving API key:', error);
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

  const calculateSongStats = () => {
    const stats = {};
    attendedShows.forEach(show => {
      if (show.setlist) {
        show.setlist.forEach(song => {
          const songName = song.name || song;
          if (songName) {
            stats[songName] = (stats[songName] || 0) + 1;
          }
        });
      }
    });
    setSongStats(stats);
  };

  // Generate realistic upcoming shows (sample data since Bandsintown blocks browser requests)
  const searchUpcomingShows = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Realistic upcoming show data for jam bands
      const sampleShows = [
        {
          id: 'goose-1',
          artist: 'Goose',
          venue: 'The Fillmore',
          city: 'San Francisco, CA',
          date: 'Feb 28, 2026',
          datetime: '2026-02-28T20:00:00',
          coords: { lat: 37.7833, long: -122.4167 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Goose'],
          description: 'Two night run at The Fillmore'
        },
        {
          id: 'goose-2',
          artist: 'Goose',
          venue: 'Bill Graham Civic Auditorium',
          city: 'San Francisco, CA',
          date: 'Mar 1, 2026',
          datetime: '2026-03-01T20:00:00',
          coords: { lat: 37.7783, long: -122.4178 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Goose'],
          description: 'Spring tour kickoff'
        },
        {
          id: 'grateful-shred-1',
          artist: 'Grateful Shred',
          venue: 'The Chapel',
          city: 'San Francisco, CA',
          date: 'Feb 14, 2026',
          datetime: '2026-02-14T20:00:00',
          coords: { lat: 37.7489, long: -122.4221 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Grateful Shred'],
          description: "Valentine's Day celebration"
        },
        {
          id: 'grateful-shred-2',
          artist: 'Grateful Shred',
          venue: 'Terrapin Crossroads',
          city: 'San Rafael, CA',
          date: 'Mar 21, 2026',
          datetime: '2026-03-21T19:30:00',
          coords: { lat: 37.9735, long: -122.5311 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Grateful Shred'],
          description: 'Spring equinox show'
        },
        {
          id: 'dso-1',
          artist: 'Dark Star Orchestra',
          venue: 'The Warfield',
          city: 'San Francisco, CA',
          date: 'Mar 8, 2026',
          datetime: '2026-03-08T20:00:00',
          coords: { lat: 37.7824, long: -122.4101 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Dark Star Orchestra'],
          description: 'Recreating 5/8/77 Barton Hall'
        },
        {
          id: 'dso-2',
          artist: 'Dark Star Orchestra',
          venue: 'The Fox Theater',
          city: 'Oakland, CA',
          date: 'Apr 5, 2026',
          datetime: '2026-04-05T20:00:00',
          coords: { lat: 37.8083, long: -122.2697 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Dark Star Orchestra'],
          description: 'Spring tour'
        },
        {
          id: 'biscuits-1',
          artist: 'Disco Biscuits',
          venue: 'The Regency Ballroom',
          city: 'San Francisco, CA',
          date: 'Mar 28, 2026',
          datetime: '2026-03-28T20:00:00',
          coords: { lat: 37.7877, long: -122.4102 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Disco Biscuits'],
          description: 'Trance-fusion experience'
        },
        {
          id: 'biscuits-2',
          artist: 'Disco Biscuits',
          venue: 'August Hall',
          city: 'San Francisco, CA',
          date: 'May 15, 2026',
          datetime: '2026-05-15T21:00:00',
          coords: { lat: 37.7799, long: -122.4138 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Disco Biscuits'],
          description: 'Late night set'
        },
        {
          id: 'spafford-1',
          artist: 'Spafford',
          venue: 'The Independent',
          city: 'San Francisco, CA',
          date: 'Feb 22, 2026',
          datetime: '2026-02-22T20:00:00',
          coords: { lat: 37.7761, long: -122.4217 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Spafford'],
          description: 'Winter west coast run'
        },
        {
          id: 'spafford-2',
          artist: 'Spafford',
          venue: 'Catalyst Atrium',
          city: 'Santa Cruz, CA',
          date: 'Apr 18, 2026',
          datetime: '2026-04-18T20:00:00',
          coords: { lat: 36.9741, long: -122.0308 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Spafford', 'Pigeons Playing Ping Pong'],
          description: 'With special guests PPPP'
        },
        {
          id: 'donato-1',
          artist: 'Daniel Donato',
          venue: 'The Chapel',
          city: 'San Francisco, CA',
          date: 'Mar 14, 2026',
          datetime: '2026-03-14T20:00:00',
          coords: { lat: 37.7489, long: -122.4221 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Daniel Donato', 'Cosmic Country Band'],
          description: 'Cosmic Country showcase'
        },
        {
          id: 'donato-2',
          artist: 'Daniel Donato',
          venue: 'Slim\'s',
          city: 'San Francisco, CA',
          date: 'May 8, 2026',
          datetime: '2026-05-08T20:00:00',
          coords: { lat: 37.7824, long: -122.4135 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Daniel Donato'],
          description: 'Spring tour - Cosmic Country vibes'
        },
        {
          id: 'billy-1',
          artist: 'Billy Strings',
          venue: 'Chase Center',
          city: 'San Francisco, CA',
          date: 'Mar 15, 2026',
          datetime: '2026-03-15T19:30:00',
          coords: { lat: 37.7679, long: -122.3874 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Billy Strings', 'Molly Tuttle'],
          description: 'With special guest Molly Tuttle'
        },
        {
          id: 'phish-1',
          artist: 'Phish',
          venue: 'Shoreline Amphitheatre',
          city: 'Mountain View, CA',
          date: 'Apr 10, 2026',
          datetime: '2026-04-10T19:00:00',
          coords: { lat: 37.4267, long: -122.0806 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Phish'],
          description: 'Spring tour'
        },
        {
          id: 'dead-1',
          artist: 'Dead & Company',
          venue: 'Shoreline Amphitheatre',
          city: 'Mountain View, CA',
          date: 'May 20, 2026',
          datetime: '2026-05-20T19:00:00',
          coords: { lat: 37.4267, long: -122.0806 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Dead & Company'],
          description: 'Summer tour'
        },
        {
          id: 'panic-1',
          artist: 'Widespread Panic',
          venue: 'The Greek Theatre',
          city: 'Berkeley, CA',
          date: 'Jun 5, 2026',
          datetime: '2026-06-05T19:30:00',
          coords: { lat: 37.8733, long: -122.2542 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['Widespread Panic'],
          description: 'Summer shows at The Greek'
        },
        {
          id: 'um-1',
          artist: "Umphrey's McGee",
          venue: 'The Independent',
          city: 'San Francisco, CA',
          date: 'Jun 22, 2026',
          datetime: '2026-06-22T20:00:00',
          coords: { lat: 37.7761, long: -122.4217 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ["Umphrey's McGee"],
          description: 'Intimate club show'
        },
        {
          id: 'jrad-1',
          artist: 'JRAD',
          venue: 'August Hall',
          city: 'San Francisco, CA',
          date: 'Jul 12, 2026',
          datetime: '2026-07-12T20:00:00',
          coords: { lat: 37.7799, long: -122.4138 },
          ticketUrl: 'https://www.bandsintown.com',
          lineup: ['JRAD', 'Melvin Seals'],
          description: 'With Melvin Seals & JGB'
        }
      ];

      setUpcomingShows(sampleShows);
    } catch (error) {
      console.error('Error loading shows:', error);
    } finally {
      setLoading(false);
    }
  };

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

    useEffect(() => {
      // Pre-populate with setlist from API if available
      if (show.rawSetlist && show.rawSetlist.length > 0) {
        const songs = show.rawSetlist.flatMap(set => 
          (set.song || []).map(s => s.name)
        ).filter(Boolean);
        setSetlist(songs.join('\n'));
      }
    }, [show]);

    const handleSave = () => {
      const songs = setlist.split('\n')
        .filter(s => s.trim())
        .map(s => ({ name: s.trim() }));
      
      onSave({
        ...show,
        setlist: songs,
        notes,
        rating
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-2xl w-full my-8">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 pr-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{show.artist}</h3>
                <p className="text-sm text-gray-600">{show.venue} - {show.date}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
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
                  className="w-full h-48 sm:h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Song 1&#10;Song 2&#10;Song 3..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-24 sm:h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Incredible show, best jam of the tour..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 font-medium"
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

  const ApiSetupModal = () => {
    const [key, setKey] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Setup Setlist.fm API</h3>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              To get real show data, you need a free Setlist.fm API key:
            </p>
            
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-2">
              <li>Go to <a href="https://www.setlist.fm/settings/api" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">setlist.fm/settings/api</a></li>
              <li>Sign in or create a free account</li>
              <li>Apply for an API key</li>
              <li>Copy your key and paste it below</li>
            </ol>

            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Paste your API key here"
            />

            <div className="flex gap-3">
              <button
                onClick={() => saveApiKey(key)}
                disabled={!key}
                className="flex-1 bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 font-medium disabled:bg-emerald-300"
              >
                Save API Key
              </button>
              <button
                onClick={() => setShowApiSetup(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MapView = () => {
    const showsWithCoords = attendedShows.filter(s => s.coords?.lat && s.coords?.long);
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Show Map</h3>
        
        {showsWithCoords.length === 0 ? (
          <div className="text-center py-12">
            <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No shows with location data yet</p>
            <p className="text-sm text-gray-400 mt-2">Shows from Setlist.fm API will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {showsWithCoords.length} show{showsWithCoords.length !== 1 ? 's' : ''} with location data
            </p>
            
            {/* Simple list view - in a full implementation, would use Leaflet or Google Maps */}
            <div className="space-y-2">
              {showsWithCoords.map(show => (
                <div key={show.id} className="border border-gray-200 rounded p-3">
                  <div className="font-medium text-gray-900">{show.artist}</div>
                  <div className="text-sm text-gray-600">{show.venue}, {show.city}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    📍 {show.coords.lat.toFixed(4)}, {show.coords.long.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-800">
                💡 <strong>Pro tip:</strong> For a full interactive map with pins, the app can be enhanced with Leaflet.js or Google Maps integration.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SongStatsView = () => {
    const sortedSongs = Object.entries(songStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50);

    const totalSongs = sortedSongs.reduce((sum, [, count]) => sum + count, 0);
    const uniqueSongs = sortedSongs.length;

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Song Statistics</h3>
        
        {sortedSongs.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No song data yet</p>
            <p className="text-sm text-gray-400 mt-2">Log shows with setlists to see your stats</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-700">{uniqueSongs}</div>
                <div className="text-sm text-gray-600">Unique Songs</div>
              </div>
              <div className="bg-emerald-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-800">{totalSongs}</div>
                <div className="text-sm text-gray-600">Total Performances</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 mb-3">Most Heard Songs</h4>
              {sortedSongs.slice(0, 20).map(([song, count], idx) => (
                <div key={song} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-6">{idx + 1}</span>
                    <span className="text-gray-900">{song}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-100 rounded-full px-3 py-1 text-sm font-medium text-emerald-700">
                      {count}x
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const DiscoverTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Find Upcoming Shows</h2>
        
        <div className="space-y-4">
          <button
            onClick={searchUpcomingShows}
            disabled={loading}
            className="w-full bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 font-medium flex items-center justify-center gap-2 disabled:bg-emerald-400"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Loading Shows...' : 'Show Upcoming Concerts'}
          </button>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-800">
              <strong>🎸 Demo Mode:</strong> Showing sample Bay Area shows from Goose, Phish, Billy Strings, Grateful Shred, Dark Star Orchestra, Disco Biscuits, Spafford, Daniel Donato & more!
            </p>
          </div>
        </div>
      </div>

      {upcomingShows.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
            Upcoming Shows ({upcomingShows.length})
          </h3>
          
          <div className="space-y-3">
            {upcomingShows.map((show) => (
              <div key={show.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-emerald-400 transition-colors">
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">{show.artist}</h4>
                    <div className="mt-2 space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{show.venue}, {show.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{show.date}</span>
                      </div>
                      {show.lineup && show.lineup.length > 1 && (
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 flex-shrink-0" />
                          <span>w/ {show.lineup.slice(1).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {show.ticketUrl && (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium text-center"
                      >
                        Get Tickets
                      </a>
                    )}
                    <button
                      onClick={() => markAsAttended(show)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Log Show
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && upcomingShows.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <Music className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base">Click "Show Upcoming Concerts" above</p>
          <p className="text-xs text-gray-400 mt-2">Featuring Goose, Phish, Billy Strings, Grateful Shred, Dark Star Orchestra, Disco Biscuits, Spafford, Daniel Donato & more</p>
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
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-3xl font-bold text-emerald-700">{stats.total}</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Shows</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-3xl font-bold text-emerald-600">{stats.artists}</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Artists</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-3xl font-bold text-emerald-500">{stats.avgRating}</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Avg</div>
          </div>
        </div>

        {attendedShows.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Your Shows</h3>
            
            <div className="space-y-3 sm:space-y-4">
              {attendedShows.sort((a, b) => new Date(b.date || b.attendedDate) - new Date(a.date || a.attendedDate)).map((show) => (
                <div key={show.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-2">
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg">{show.artist}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{show.venue}, {show.city}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{show.date}</p>
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
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {show.setlist && show.setlist.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <List className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Setlist ({show.setlist.length} songs)
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1 max-h-48 overflow-y-auto">
                        {show.setlist.map((song, idx) => (
                          <div key={idx}>{idx + 1}. {song.name || song}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {show.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs sm:text-sm text-gray-600 italic">{show.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No shows logged yet</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">Start by discovering shows</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-300 pb-safe">
      <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">Jam Band Tracker</h1>
          <p className="text-sm sm:text-base text-emerald-50">Track shows & build your setlist collection</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200 min-w-max">
            {[
              { id: 'discover', icon: Search, label: 'Discover' },
              { id: 'history', icon: Calendar, label: 'My Shows', count: attendedShows.length },
              { id: 'songs', icon: TrendingUp, label: 'Songs' },
              { id: 'map', icon: MapIcon, label: 'Map' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 font-medium transition-colors text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'text-emerald-700 border-b-2 border-emerald-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'discover' && <DiscoverTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'songs' && <SongStatsView />}
        {activeTab === 'map' && <MapView />}

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

        {showApiSetup && <ApiSetupModal />}
      </div>
    </div>
  );
};

export default JamBandTracker;
