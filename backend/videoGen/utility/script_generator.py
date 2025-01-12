from groq import Groq
import json
import re
from videoGen.env_vars import GROQ_API_KEY, GROQ_MODEL
from prompts.prompts import SCRIPT_PROMPT

#-----------------------------------------------------------

# setup Groq client
model = GROQ_MODEL
client = Groq(api_key=GROQ_API_KEY)

#-----------------------------------------------------------

def clean_json_string(s: str) -> str:
    # Remove any non-printable characters except valid whitespace
    s = ''.join(char for char in s if char.isprintable() or char in '\n\r\t')

    # Find the first { and last } to extract just the JSON object
    start = s.find('{')
    end = s.rfind('}') + 1
    if start != -1 and end != 0:
        s = s[start:end]

    return s

def extract_script_content(content: str) -> str:
    # Try to extract script content using regex
    match = re.search(r'"script":\s*"((?:[^"\\]|\\.)*)"', content, re.DOTALL)
    if match:
        return match.group(1).replace('\\"', '"')
    return None

def script_generator(topic):
    try:
        response = client.chat.completions.create(
            model,
            messages=[
                {"role": "system", "content": SCRIPT_PROMPT},
                {"role": "user", "content": topic}
            ]
        )

        content = response.choices[0].message.content
        print("Raw response:", content)
        
        cleaned_content = clean_json_string(content)
        print("Cleaned response:", cleaned_content)
        
        try:
            script = json.loads(cleaned_content)["script"]
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            script = extract_script_content(cleaned_content)
        
        if script is None:
            raise Exception("Could not parse script content")
        
        return script
    except Exception as e:
        print(f"Error in script generation: {e}")
        raise
