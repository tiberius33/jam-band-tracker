// Netlify Function to search for ANY band by name
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
    // Get artist name from query parameter
    const artistName = event.queryStringParameters?.artist;
    
    if (!artistName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing artist parameter'
        })
      };
    }

    console.log(`Searching for artist: ${artistName}`);

    // Fetch shows from Bandsintown
    const response = await fetch(
      `https://rest.bandsintown.com/artists/${encodeURIComponent(artistName)}/events?app_id=jam_band_tracker_netlify`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Bandsintown API returned ${response.status}`);
    }

    const events = await response.json();
    
    console.log(`${artistName}: ${Array.isArray(events) ? events.length : 0} events found`);
    
    let shows = [];

    if (Array.isArray(events) && events.length > 0) {
      // Filter and format events - include shows from last 7 days and all future shows
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      shows = events
        .filter(e => {
          const showDate = new Date(e.datetime);
          return showDate >= sevenDaysAgo;
        })
        .slice(0, 20) // Top 20 shows for single artist search
        .map(e => ({
          id: e.id || `${artistName}-${e.datetime}`,
          artist: artistName,
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
          lineup: e.lineup || [artistName],
          description: e.description || ''
        }));
    }

    // Sort by date
    shows.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        artist: artistName,
        count: shows.length,
        shows: shows
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
