# ai_core.py

import os
import json
import io
import google.generativeai as genai
from PIL import Image
from prompts import (
    identify_object_prompt,
    generate_learning_cards_prompt,
    get_skill_tag_prompt,
)

from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Model Definitions
object_model = genai.GenerativeModel('gemini-1.5-flash')
cards_model = genai.GenerativeModel('gemini-2.5-pro')
tagger_model = genai.GenerativeModel('gemini-1.5-flash')

def identify_object(image_data):
    try:
        img = Image.open(io.BytesIO(bytes(image_data)))
        
        prompt = identify_object_prompt(img)
        response = object_model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned_response)
    except Exception as e:
        print(f"An error occurred during object identification: {e}")
        return None

def generate_learning_cards(object_name, category, grade_level):
    try:
        prompt = generate_learning_cards_prompt(object_name, category, grade_level)
        response = cards_model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned_response)
    except Exception as e:
        print(f"An error occurred during card generation: {e}")
        return None

def extract_skills(text_content):
    try:
        prompt = get_skill_tag_prompt(text_content)
        response = tagger_model.generate_content(prompt)
        return eval(response.text.strip())
    except Exception as e:
        print(f"An error occurred during skill extraction: {e}")
        return None