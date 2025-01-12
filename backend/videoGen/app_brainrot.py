import os
import sys
import logging
import argparse
import asyncio
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeVideoClip, TextClip
from utility.script_generator import script_generator
from utility.voice_generator import voice_generator
from utility.timed_captions_generator import generate_timed_captions
import random

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def process_video(script: str, output_filename: str) -> str:
    try:
        # Ensure output directory exists
        output_dir = os.path.dirname(output_filename)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)

        # Generate audio from the script
        audio_filename = os.path.join(output_dir, "./temp/audio_tts.wav")
        asyncio.run(voice_generator(script, audio_filename))
        logging.info("Generated audio narration")

        # Generate timestamped captions
        timed_captions = generate_timed_captions(audio_filename)
        logging.info("Generated timed captions")

        # Load the generated audio
        audio = AudioFileClip(audio_filename)

        # List of available background videos with proper paths
        background_clips = [
            os.path.join(os.path.dirname(__file__), "assets", "parkour.mp4"),
            os.path.join(os.path.dirname(__file__), "assets", "parkour2.mp4"),
            os.path.join(os.path.dirname(__file__), "assets", "parkour3.mp4"),
        ]

        # Randomly select a background video
        selected_background = random.choice(background_clips)
        logging.info(f"Selected background video: {selected_background}")

        # Load and prepare the background video
        video = VideoFileClip(selected_background)

        # Adjust video length to match audio
        if video.duration < audio.duration:
            video = video.loop(duration=audio.duration)
        else:
            video = video.subclip(0, audio.duration)

        # Create subtitle clips with styling
        subtitle_clips = []
        for (t1, t2), text in timed_captions:
            subtitle_clip = TextClip(
                txt=text,
                fontsize=30,
                color='white',
                stroke_color='black',
                stroke_width=1
            )
            subtitle_clip = (
                subtitle_clip
                .set_pos(('center', 900))
                .set_duration(t2 - t1)
                .set_start(t1)
            )
            subtitle_clips.append(subtitle_clip)

        # Combine background video with subtitles
        final_video = CompositeVideoClip([video] + subtitle_clips)

        # Add audio to the video
        final_video = final_video.set_audio(audio)

        # Save the final video
        logging.info(f"Writing video to: {output_filename}")
        final_video.write_videofile(
            output_filename,
            codec='libx264',
            audio_codec='aac',
            fps=25,
            preset='veryfast'
        )

        return output_filename

    except Exception as e:
        logging.error(f"Error processing video: {str(e)}")
        raise

    finally:
        # Cleanup temporary files and objects
        if os.path.exists(audio_filename):
            os.remove(audio_filename)
        if 'video' in locals():
            video.close()
        if 'final_video' in locals():
            final_video.close()
        if 'audio' in locals():
            audio.close()

if __name__ == "__main__":
    # Setup command line argument parser
    parser = argparse.ArgumentParser(description="Generate a Brainrot-style video.")
    parser.add_argument("topic", type=str, help="The topic for the video")
    parser.add_argument("output_filename", type=str, help="The output filename for the video")

    args = parser.parse_args()

    try:
        # Generate script from topic
        script = script_generator(args.topic)
        logging.info(f"Generated script: {script}")

        # Process and generate final video
        output_file = process_video(script, args.output_filename)
        logging.info(f"Video generation complete. Saved to: {output_file}")
    except Exception as e:
        logging.error(f"Video generation failed: {str(e)}")
        sys.exit(1)
