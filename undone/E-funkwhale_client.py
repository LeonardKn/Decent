import requests
import json

def get_funkwhale_tracks(instance_url="https://play.somedomain.com", api_endpoint="/api/v2/tracks/"):
    url = f"{instance_url}{api_endpoint}"

    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        tracks_data = response.json()

        # Process the tracks_data
        for track in tracks_data.get('results', []): # API responses are often paginated with 'results' key
            title = track.get('title', 'N/A')
            artist = track.get('artist', {}).get('name', 'N/A') # Assuming artist is an object with a name
            album = track.get('album', {}).get('title', 'N/A') # Assuming album is an object with a title
            print(f"Title: {title}\nArtist: {artist}\nAlbum: {album}\n---")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
    except json.JSONDecodeError:
        print("Error decoding JSON response.")
    
if __name__ == "__main__":
    get_funkwhale_tracks()

