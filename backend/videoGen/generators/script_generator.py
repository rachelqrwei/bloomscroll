from groq import Groq
import json
import re
from videoGen.env_vars import GROQ_API_KEY, GROQ_MODEL
from videoGen.utility.prompts.model_prompts import SCRIPT_PROMPT

#-----------------------------------------------------------

# Setup Groq client
model = GROQ_MODEL
client = Groq(api_key=GROQ_API_KEY)

#-----------------------------------------------------------

def clean_json_string(s: str) -> str:
    # Remove any non-printable characters except valid whitespace
    s = ''.join(char for char in s if char.isprintable() or char in '\n\r\t')

    # Find the first '{' and last '}' to extract just the JSON object
    start = s.find('{')
    end = s.rfind('}') + 1
    if start != -1 and end != 0:
        s = s[start:end]

    return s

def regex_extract_script(content: str) -> str:
    # Try to extract script content using regex
    match = re.search(r'"script":\s*"((?:[^"\\]|\\.)*)"', content, re.DOTALL)
    if match:
        return match.group(1).replace('\\"', '"')
    return None

def script_generator(topic):
    try:
        # Get response from API call
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SCRIPT_PROMPT},
                {"role": "user", "content": topic}
            ]
        )

        # Grab raw response
        content = response.choices[0].message.content
        print("Raw response:", content)
        
        # Execute raw content
        cleaned_content = clean_json_string(content)
        print("Cleaned response:", cleaned_content)
        
        try:
            # Parse JSON & get script
            script = json.loads(cleaned_content)["script"]
        except json.JSONDecodeError as e:
            # Handle invalid JSON & attempt regex extraction
            print(f"JSON decode error: {e}")
            script = regex_extract_script(cleaned_content)
        
        # Check if script is None after all attempts
        if script is None:
            raise Exception("Could not parse script content")
        
        return script
    except Exception as e:
        # Print error
        print(f"Error in script generation: {e}")
        raise


def main():
    topic = "This is a test of the script generator, say \"Success!\"."
    print(script_generator(topic))

if __name__ == "__main__":
    main()
