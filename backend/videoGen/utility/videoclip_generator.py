import os 
import requests
from utility.utils import log_response, LOG_TYPE_PEXEL
from dotenv import load_dotenv
from typing import List, Tuple, Optional

# load environment variables
load_dotenv()

# get pexels api key from environment
PEXELS_API_KEY = os.getenv('PEXELS_API_KEY')

#search for videos on pexels matching the query string
#   query_string(str): search term to find videos
#   orientation_landscape(bool): whether to search for landscape (16:9) or portrait (9:16) videos
#returns dict of json response from pexels api containing video results
def search_videos(query_string: str, orientation_landscape: bool = True) -> dict:
    url = "https://api.pexels.com/videos/search"
    headers = {
        "Authorization": PEXELS_API_KEY,
        "User-Agent": "Mozilla/5.0"
    }
    params = {
        "query": query_string,
        "orientation": "landscape" if orientation_landscape else "portrait",
        "per_page": 3,
        "size": "large",
        "duration": "medium"
    }

    response = requests.get(url, headers=headers, params=params)
    json_data = response.json()
    log_response(LOG_TYPE_PEXEL, query_string, json_data)
    return json_data

def getBestVideo(query_string: str, orientation_landscape: bool = True, used_vids: List[str] = None) -> Optional[str]:
    """
    get the best matching video for the query that hasn't been used yet
    
    args:
        query_string (str): search term to find video
        orientation_landscape (bool): whether to get landscape (16:9) or portrait (9:16) video
        used_vids (List[str]): list of video urls that have already been used
        
    returns:
        Optional[str]: url of best matching video, or None if no matches found
    """
    if used_vids is None:
        used_vids = []
        
    vids = search_videos(query_string, orientation_landscape)
    videos = vids.get('videos', [])

    # Simplified filtering with less strict requirements
    if orientation_landscape:
        filtered_videos = [
            video for video in videos 
            if video['width'] >= 1280 and video['height'] >= 720
            and video['duration'] <= 20
        ]
    else:
        filtered_videos = [
            video for video in videos
            if video['width'] >= 720 and video['height'] >= 1280
            and video['duration'] <= 20
        ]

    # Sort by duration (prefer shorter videos)
    sorted_videos = sorted(filtered_videos, key=lambda x: x['duration'])

    for video in sorted_videos:
        for video_file in video['video_files']:
            if orientation_landscape:
                if video_file['width'] >= 1280 and video_file['height'] >= 720:
                    if video_file['link'].split('.hd')[0] not in used_vids:
                        return video_file['link']
            else:
                if video_file['width'] >= 720 and video_file['height'] >= 1280:
                    if video_file['link'].split('.hd')[0] not in used_vids:
                        return video_file['link']
                        
    print(f"no matching videos found for query: {query_string}")
    return None

def generate_video_url(timed_video_searches: List[Tuple[List[float], List[str]]], video_server: str) -> List[Tuple[List[float], Optional[str]]]:
    """
    generate video urls for each timed search term, ensuring max 15 videos
    """
    timed_video_urls = []
    
    if video_server == "pexel":
        used_links = []
        
        # If we have more than 15 segments, merge adjacent ones
        if len(timed_video_searches) > 15:
            merged_searches = []
            for i in range(0, len(timed_video_searches), 2):
                if i + 1 < len(timed_video_searches):
                    start_time = timed_video_searches[i][0][0]
                    end_time = timed_video_searches[i+1][0][1]
                    # Combine search terms
                    search_terms = timed_video_searches[i][1] + timed_video_searches[i+1][1]
                    merged_searches.append([[start_time, end_time], search_terms])
                else:
                    merged_searches.append(timed_video_searches[i])
            timed_video_searches = merged_searches
        
        # Get video for each time segment
        for (t1, t2), search_terms in timed_video_searches:
            url = None
            for query in search_terms:
                url = getBestVideo(query, orientation_landscape=False, used_vids=used_links)
                if url:
                    used_links.append(url.split('.hd')[0])
                    break
            timed_video_urls.append([[t1, t2], url])

    return timed_video_urls

def generate_video_clips(script_sections):
    clips = []
    total_sections = len(script_sections)
    
    for i, section in enumerate(script_sections):
        # Report progress (each section is roughly 20% of total progress)
        progress = int((i / total_sections) * 20)
        print(f"PROGRESS: {progress}")
        
        # Generate clip for this section
        clip = generate_clip_for_section(section)
        clips.append(clip)
    
    print("PROGRESS: 20")  # Video clips generation complete
    return clips