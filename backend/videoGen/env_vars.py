from dotenv import load_dotenv
load_dotenv()

import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_MODEL = os.getenv("GROQ_MODEL")

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")

ELEVEN_LABS_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

ELEVEN_LABS_VOICE = os.getenv("ELEVEN_LABS_VOICE")

ELEVEN_LABS_MODEL = os.getenv("ELEVEN_LABS_MODEL")