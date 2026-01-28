// Netlify Function to fetch Bandsintown shows
// This runs on the server so no CORS issues!

exports.handler = async (event, context) => {
  // Enable CORS for your frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // List of jam bands to search
    const jamBands = [
      'Goose',
      'Phish',
      'Dead & Company',
      'Billy Strings',
      'Widespread Panic',
      "Umphrey's McGee",
      'JRAD',
      'Grateful Shred',
      'Dark Star Orchestra',
      'Disco Biscuits',
      'Spafford',
      'Daniel Donato'
    ];

    const allShows = [];

    // Fetch shows for each band
    for (const bandName of jamBands) {
      try {
        const response = await fetch(
          `https://rest.bandsintown.com/artists/${encodeURIComponent(bandName)}/events?app_id=jam_band_tracker_netlify`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        if (response.ok) {
          const events = await response.json();
          
          if (Array.isArray(events) && events.length > 0) {
            // Filter and format events
            const shows = events
              .filter(e => {
                const showDate = new Date(e.datetime);
                return showDate >= new Date();
              })
              .slice(0, 5) // Top 5 per band
              .map(e => ({
                id: e.id || `${bandName}-${e.datetime}`,
                artist: bandName,
                venue: e.venue?.name || 'TBA',
                city: e.venue?.city && e.venue?.country 
                  ? `${e.venue.city}${e.venue.region ? ', ' + e.venue.region : ''}`
                  : 'TBA',
                date: new Date(e.datetime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }),
                datetime: e.datetime,
                coords: e.venue?.latitude && e.venue?.longitude 
                  ? { lat: parseFloat(e.venue.latitude), long: parseFloat(e.venue.longitude) }
                  : null,
                ticketUrl: e.offers && e.offers.length > 0 ? e.offers[0].url : e.url,
                lineup: e.lineup || [bandName],
                description: e.description || ''
              }));
            
            allShows.push(...shows);
          }
        }
      } catch (bandError) {
        console.error(`Error fetching ${bandName}:`, bandError);
        // Continue with other bands even if one fails
      }
    }

    // Sort by date
    allShows.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: allShows.length,
        shows: allShows
      })
    };

  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch shows',
        message: error.message
      })
    };
  }
};
