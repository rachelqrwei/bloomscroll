import os
import edge_tts
import json
import asyncio
import whisper_timestamped as whisper
from utility.script_generator import script_generator
from utility.voice_generator import voice_generator
from utility.timed_captions_generator import generate_timed_captions
from utility.videoclip_generator import generate_video_url
from utility.render_engine import get_output_media
from utility.video_search import getVideoSearchQueriesTimed, merge_empty_intervals
import argparse
import logging

# configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

#generates a video using pexel stock based on a topic
#   topic(str)=the topic to generate content about
#   output_filename(str)=where to save the final video
#returns the path to the generated video file.
def generate_pexel_video(topic: str, output_filename: str) -> str:
    try:
        # temporary file for audio generation
        audio_filename = "audio_tts.wav"
        
        # generate script from topic
        script = script_generator(topic)
        logging.info(f"generated script: {script}")

        # generate audio narration
        asyncio.run(voice_generator(script, audio_filename))
        logging.info("generated audio narration")

        # generate timestamped captions
        timed_captions = generate_timed_captions(audio_filename)
        logging.info("generated timed captions")

        # generate search terms for video clips
        search_terms = getVideoSearchQueriesTimed(script, timed_captions)
        if not search_terms:
            raise ValueError("failed to generate search terms for video clips")
        logging.info(f"generated search terms: {search_terms}")

        # get video urls from pexel
        background_video_urls = generate_video_url(search_terms, "pexel")
        if not background_video_urls:
            raise ValueError("no background videos found")
        logging.info(f"found {len(background_video_urls)} background videos")

        # merge any gaps in video coverage
        background_video_urls = merge_empty_intervals(background_video_urls)

        # generate final video
        video_path = get_output_media(
            audio_filename,
            timed_captions,
            background_video_urls,
            "pexel",
            output_filename
        )
        logging.info(f"generated final video: {video_path}")

        return video_path

    except Exception as e:
        logging.error(f"error generating video: {str(e)}")
        raise

    finally:
        # cleanup temporary files
        if os.path.exists(audio_filename):
            os.remove(audio_filename)

if __name__ == "__main__":
    # setup command line argument parser
    parser = argparse.ArgumentParser(description="Generate a video using Pexel stock footage.")
    parser.add_argument("topic", type=str, help="The topic for the video")
    parser.add_argument("output_filename", type=str, help="The output filename for the video")

    args = parser.parse_args()

    # generate the video
    try:
        output_file = generate_pexel_video(args.topic, args.output_filename)
        logging.info(f"video generation complete. saved to: {output_file}")
    except Exception as e:
        logging.error(f"video generation failed: {str(e)}")
        raise