import os
import edge_tts
import json
import logging
import argparse
import asyncio
import whisper_timestamped as whisper
from videoGen.generators.script_generator import script_generator
from videoGen.generators.voice_generator import voice_generator
from videoGen.generators.timed_captions_generator import generate_timed_captions
from videoGen.generators.videoclip_generator import generate_video_url
from videoGen.utility.render_engine import get_output_media
from videoGen.utility.video_search import getVideoSearchQueriesTimed, merge_empty_intervals

# Configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

#generates a video using pexel stock based on a topic
#   topic(str)=the topic to generate content about
#   output_filename(str)=where to save the final video
#returns the path to the generated video file.
def generate_pexel_video(topic: str, output_filename: str) -> str:
    try:
        # Ensure output directory exists
        output_dir = os.path.dirname(output_filename)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        
        # Generate script from topic
        script = script_generator(topic)
        logging.info(f"Generated script: {script}")

        # Generate audio from the script
        audio_filename = os.path.join(output_dir, "temp/audio_tts.wav")
        asyncio.run(voice_generator(script, audio_filename))
        logging.info("Generated audio narration")

        # Generate timestamped captions
        timed_captions = generate_timed_captions(audio_filename)
        logging.info("Generated timed captions")

        # Generate search terms for video clips
        search_terms = getVideoSearchQueriesTimed(script, timed_captions)
        if not search_terms:
            raise ValueError("failed to generate search terms for video clips")
        logging.info(f"Generated search terms: {search_terms}")

        # Get video urls from pexel
        background_video_urls = generate_video_url(search_terms, "pexel")
        if not background_video_urls:
            raise ValueError("no background videos found")
        logging.info(f"Found {len(background_video_urls)} background videos")

        # Merge any gaps in video coverage
        background_video_urls = merge_empty_intervals(background_video_urls)

        # Generate final video
        video_path = get_output_media(
            audio_filename,
            timed_captions,
            background_video_urls,
            "pexel",
            output_filename
        )
        logging.info(f"Generated final video: {video_path}")

        return video_path

    except Exception as e:
        logging.error(f"Error generating video: {str(e)}")
        raise

    finally:
        # Cleanup temporary files
        if os.path.exists(audio_filename):
            os.remove(audio_filename)

if __name__ == "__main__":
    # Setup command line argument parser
    parser = argparse.ArgumentParser(description="Generate a video using Pexel stock footage.")
    parser.add_argument("topic", type=str, help="The topic for the video")
    parser.add_argument("output_filename", type=str, help="The output filename for the video")

    args = parser.parse_args()

    # Generate the video
    try:
        output_file = generate_pexel_video(args.topic, args.output_filename)
        logging.info(f"Video generation complete. Saved to: {output_file}")
    except Exception as e:
        logging.error(f"Video generation failed: {str(e)}")
        raise