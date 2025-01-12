import os
import tempfile
import platform
import subprocess
from moviepy import (
    AudioFileClip,
    CompositeVideoClip,
    CompositeAudioClip,
    TextClip,
    VideoFileClip
)
import requests

# download file from url and save it locally
#   url (str): the url to download from
#   filename (str): where to save the downloaded file
def download_file(url, filename):
    with open(filename, 'wb') as f:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, headers=headers)
        f.write(response.content)

#search for a program in the system path
#   program_name (str): name of the program to find
#   returns:
#       str or None: path to the program if found, None otherwise
def search_program(program_name):
    try: 
        search_cmd = "where" if platform.system() == "Windows" else "which"
        return subprocess.check_output([search_cmd, program_name]).decode().strip()
    except subprocess.CalledProcessError:
        return None

# get the full path of a program
def get_program_path(program_name):
    return search_program(program_name)

# combine audio, background videos, and captions into a final video
#   audio_file (str): path to the audio file
#   timed_captions (list): list of (start_time, end_time, text) tuples
#   background_video_urls (list): list of video urls to use as background
#   video_server (str): type of video server being used, either pexel or brainrot
#   output_filename (str, optional): path for the output video
#   returns:
#       str: path to the generated video file
def get_output_media(audio_file, timed_captions, background_video_urls, video_server, output_filename=None):
    try:        
        # ensure output directory exists
        output_dir = os.path.dirname(output_filename)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        
        # setup imagemagick for text rendering
        magick_path = get_program_path("magick")
        print(f"imagemagick path: {magick_path}")
        os.environ['IMAGEMAGICK_BINARY'] = magick_path if magick_path else '/usr/bin/convert'
        
        visual_clips = []
        temp_files = []  # track temporary files for cleanup

        # download and prepare background videos
        for (t1, t2), video_url in background_video_urls:
            video_filename = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False).name
            temp_files.append(video_filename)
            download_file(video_url, video_filename)
            
            video_clip = VideoFileClip(video_filename)
            video_clip = video_clip.with_start(t1).with_end(t2).resized((720,1280))
            visual_clips.append(video_clip)
        
        # prepare audio
        audio_clips = []
        audio_file_clip = AudioFileClip(audio_file)
        audio_clips.append(audio_file_clip)

        # create caption overlays
        for (t1, t2), text in timed_captions:
            # Create background clip
            bg_clip = TextClip(
                text=text,  # Create background sized to text
                font_size=32,
                color='black',
                stroke_color='black',
                stroke_width=1,
                bg_color='black',
                font='Arial'
            ).with_duration(t2 - t1).with_start(t1).with_position(('center', 900))

            # Create text clip with shadow
            subtitle_clip = TextClip(
                text=text,
                font_size=30,
                color='white',
                stroke_color='black',  # Add a shadow-like effect
                stroke_width=2,        # Increase stroke width for better visibility
                font='Arial'
            ).with_duration(t2 - t1).with_start(t1).with_position(('center', 900))

            # Add clips to the visual_clips list
            visual_clips.append(bg_clip)
            visual_clips.append(subtitle_clip)

        # combine all visual elements
        video = CompositeVideoClip(visual_clips, size=(720,1280))
        
        # add audio if available
        if audio_clips:
            audio = CompositeAudioClip(audio_clips)
            video.duration = audio.duration
            video.audio = audio

        # save final video
        print(f"writing video to: {output_filename}")
        video.write_videofile(
            output_filename,
            codec='libx264',
            audio_codec='aac',
            fps=25,
            preset='veryfast'
        )
        
        return output_filename

    except Exception as e:
        print(f"error in get_output_media: {str(e)}")
        raise

    finally:
        # cleanup temporary files
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            except Exception as e:
                print(f"error cleaning up temp file {temp_file}: {str(e)}")
        
        # cleanup video objects
        if 'video' in locals():
            video.close()
        if 'audio' in locals():
            audio.close()
        for clip in visual_clips:
            clip.close()
