import os
import sys
import logging
import argparse
import asyncio
import random
from moviepy import VideoFileClip, AudioFileClip, CompositeVideoClip, TextClip
from videoGen.generators.script_generator import script_generator
from videoGen.generators.voice_generator import voice_generator
from videoGen.generators.timed_captions_generator import generate_timed_captions

# Configure logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def process_video(topic: str, output_filename: str) -> str:
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
            video = video.with_section_cut_out(0, video.duration - audio.duration)

        # Create subtitle clips with styling
        subtitle_clips = []
        for (t1, t2), text in timed_captions:
            # Create background clip
            bg_clip = TextClip(
                text=text,  # Create background sized to text
                font_size=32,
                font='Arial',
                color='black',
                stroke_color='black',
                stroke_width=1,
                bg_color='black'
            ).with_duration(t2 - t1).with_start(t1)
            
            # Create text clip
            subtitle_clip = TextClip(
                text=text,
                font_size=30,
                font='Arial',
                color='white',
                stroke_color='black',
                stroke_width=1
            ).with_duration(t2 - t1).with_start(t1)
            
            subtitle_clips.append(bg_clip.with_position(('center', 900)))
            subtitle_clips.append(subtitle_clip.with_position(('center', 900)))

        # Combine background video with subtitles
        final_video = CompositeVideoClip([video] + subtitle_clips)

        # Add audio to the video
        final_video = final_video.with_audio(audio)

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

    # Generate the video
    try:
        # Process and generate final video
        output_file = process_video(args.topic, args.output_filename)
        logging.info(f"Video generation complete. Saved to: {output_file}")
    except Exception as e:
        logging.error(f"Video generation failed: {str(e)}")
        sys.exit(1)
