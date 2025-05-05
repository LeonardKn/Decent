import sys
import requests
import json
import re

#EX: python friendica_client.py https://inne.city

def fetch_frederica_posts(instance_url="https://inne.city"):
    api_endpoint="/api/v1/timelines/public"
    url = f"{instance_url}{api_endpoint}"

    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        statuses_data = response.json()

        # Process the statuses_data
        if isinstance(statuses_data, list): # The public timeline endpoint usually returns a list
            for status in statuses_data:
                # Extract relevant information (structure is similar to Mastodon API status object)
                account = status.get('account', {})
                display_name = account.get('display_name', account.get('username', 'N/A'))
                username = account.get('username', 'N/A')
                content = status.get('content', 'No content')
                created_at = status.get('created_at', 'N/A')

                # Basic cleaning of HTML content (Mastodon API often returns HTML)
                # For a simple display, you might want to remove HTML tags
                cleaned_content = re.sub('<.*?>', '', content)

                print(f"[{created_at}] {display_name} (@{username}):")
                print(cleaned_content)
                print("---\n")
        else:
            print("Unexpected data format received.")


    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
    except json.JSONDecodeError:
        print("Error decoding JSON response.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        
        
if __name__ == "__main__":
    fetch_frederica_posts(instance_url=sys.argv[1])