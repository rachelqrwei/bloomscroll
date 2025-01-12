import asyncio
import os
from elevenlabs import generate, save, set_api_key
from videoGen.env_vars import ELEVEN_LABS_API_KEY, ELEVEN_LABS_VOICE, ELEVEN_LABS_MODEL

#-----------------------------------------------------------

# Set ElevenLabs client
set_api_key(ELEVEN_LABS_API_KEY)
voice = ELEVEN_LABS_VOICE
model = ELEVEN_LABS_MODEL

#-----------------------------------------------------------

# generate audio with voice Brian
#   text(str): the text to generate audio for
#   output_filename(str): the path to save the audio file
async def voice_generator(text, output_filename):
    try:        
        # Generate audio with voice Brian
        audio = generate(
            text=text,
            voice=voice,
            model=model
        )
        # Save the audio
        save(audio, output_filename)
        
        # Raise error if file doesn't exist
        if not os.path.exists(output_filename):
            raise FileNotFoundError(f"Failed to create audio file: {output_filename}")
        
        print(f"Audio file generated successfully: {output_filename}")
    # For other errors
    except Exception as e:
        print(f"Error in voice generation: {str(e)}")
        raise


async def main():
    text_to_generate = "This is a test of the ElevenLabs API."
    output_file = "output.mp3"
    await voice_generator(text_to_generate, output_file)

if __name__ == "__main__":
    asyncio.run(main())
