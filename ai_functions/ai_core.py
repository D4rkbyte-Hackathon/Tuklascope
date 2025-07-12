import re
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

load_dotenv()
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    exit()

# reads the prompt and return its contetns
def _read_prompt(file_path: str) -> str:
    try:
        with open(file_path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: Prompt file not found at {file_path}")
        return None

# --- AI FUNCTIONS ---
def identify_object_from_image(image_path: str) -> dict | None:

    prompt_path = os.path.join(os.path.dirname(__file__), 'prompts', 'identify_object.prompt')
    prompt_template = _read_prompt(prompt_path)
    if not prompt_template: return None

    try:
        img = Image.open(image_path)
        model = genai.GenerativeModel('gemini-2.5-flash') #-----------------------------------------------para makit an dayon
        response = model.generate_content([prompt_template, img])

        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        cleaned_text = match.group(0) if match else response.text

        return json.loads(cleaned_text)
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from identification model. Raw response: {response.text}")
        return None
    except Exception as e:
        print(f"An error occurred in identify_object_from_image: {e}")
        return None

def generate_spark_content(object_info: dict, grade_level: str) -> dict | None:

    prompt_path = os.path.join(os.path.dirname(__file__), 'prompts', 'generate_spark_content.prompt')
    prompt_template = _read_prompt(prompt_path)
    if not prompt_template: return None

    formatted_prompt = prompt_template.format(
        grade_level=grade_level,
        user_location="Philippines", # Location set to Philippines for now
        object_label=object_info.get('object_label'),
        category_hint=object_info.get('category_hint')
    )

    try:
        model = genai.GenerativeModel('gemini-2.5-pro') #-----------------------------------------------para makit an dayon
        response = model.generate_content(formatted_prompt)

        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        cleaned_text = match.group(0) if match else response.text

        return json.loads(cleaned_text)
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from content generation model. Raw response: {response.text}")
        return None
    except Exception as e:
        print(f"An error occurred in generate_spark_content: {e}")
        return None