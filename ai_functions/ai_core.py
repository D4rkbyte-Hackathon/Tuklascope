import os
import io
import json
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
from pydantic import ValidationError

from main import IdentificationModel, SparkContentModel, SkillsResponseModel, PathfinderResponseModel

load_dotenv()

try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=gemini_api_key)
except (ValueError, Exception) as e:
    print(f"Fatal Error: Could not configure Gemini API. {e}")
    exit()

# --- Helper function to read prompt files ---
def _read_prompt(file_path: str) -> str | None:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading prompt file {file_path}: {e}")
        return None
    

def get_identified_object(image_bytes: bytes) -> IdentificationModel | None:
    """Identifies an object from in-memory image bytes and validates the response."""
    prompt_template = _read_prompt(os.path.join('prompts', 'ai_object_identification.prompt'))
    if not prompt_template: return None

    try:
        img = Image.open(io.BytesIO(image_bytes))
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([prompt_template, img], request_options={"timeout": 60})
        return IdentificationModel.model_validate_json(response.text)
    except ValidationError as e:
        print(f"[AI Validation Error] in get_identified_object: {e}")
        return None
    except Exception as e:
        print(f"[AI Core Error] in get_identified_object: {e}")
        return None

def generate_spark_content(object_info: IdentificationModel, grade_level: str) -> SparkContentModel | None:
    """Generates educational content and validates the response."""
    prompt_template = _read_prompt(os.path.join('prompts', 'ai_spark_content_generation.prompt'))
    if not prompt_template: return None

    formatted_prompt = prompt_template.format(
        grade_level=grade_level,
        user_location="Philippines",
        object_label=object_info.object_label,
        category_hint=object_info.category_hint
    )
    try:
        model = genai.GenerativeModel('gemini-2.5-pro')
        response = model.generate_content(formatted_prompt, request_options={"timeout": 90})
        return SparkContentModel.model_validate_json(response.text)
    except ValidationError as e:
        print(f"[AI Validation Error] in generate_spark_content: {e}")
        return None
    except Exception as e:
        print(f"[AI Core Error] in generate_spark_content: {e}")
        return None

def get_normalized_stem_skills(spark_content: SparkContentModel) -> SkillsResponseModel | None:
    """Extracts STEM skills from content and validates the response."""
    prompt_template = _read_prompt(os.path.join('prompts', 'ai_skill_extraction.prompt'))
    if not prompt_template: return None

    content_to_analyze = (
        f"Quick Facts: {spark_content.quick_facts}\n\n"
        f"STEM Concepts: {spark_content.stem_concepts}\n\n"
        f"Hands-On Project: {spark_content.hands_on_project}"
    )
    formatted_prompt = prompt_template.format(content_to_analyze=content_to_analyze)
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(formatted_prompt, request_options={"timeout": 60})
        return SkillsResponseModel.model_validate_json(response.text)
    except ValidationError as e:
        print(f"[AI Validation Error] in get_normalized_stem_skills: {e}")
        return None
    except Exception as e:
        print(f"[AI Core Error] in get_normalized_stem_skills: {e}")
        return None

def get_pathfinder_guidance(user_skills: dict, grade_level: str) -> PathfinderResponseModel | None:
    """Generates personalized academic/career guidance and validates the response."""
    prompt_template = _read_prompt(os.path.join('prompts', 'ai_pathfinder_guidance.prompt'))
    if not prompt_template: return None

    formatted_prompt = prompt_template.format(
        grade_level=grade_level,
        user_skills_json=json.dumps(user_skills),
        current_date_time=datetime.now().strftime("%A, %B %d, %Y")
    )
    try:
        model = genai.GenerativeModel('gemini-2.5-pro')
        response = model.generate_content(formatted_prompt, request_options={"timeout": 90})
        return PathfinderResponseModel.model_validate_json(response.text)
    except ValidationError as e:
        print(f"[AI Validation Error] in get_pathfinder_guidance: {e}")
        return None
    except Exception as e:
        print(f"[AI Core Error] in get_pathfinder_guidance: {e}")
        return None

def get_ai_tutor_response(user_question: str, grade_level: str, chat_history: list[dict] | None, object_context: str | None) -> str | None:
    """Generates a conversational response from the AI tutor."""
    prompt_template = _read_prompt(os.path.join('prompts', 'ai_tutor_conversation.prompt'))
    if not prompt_template: return None

    formatted_prompt = prompt_template.format(
        grade_level=grade_level,
        user_question=user_question,
        context_addon=f"The user is currently looking at content about a '{object_context}'. " if object_context else "",
        chat_history_json=json.dumps(chat_history or []),
        current_date_time=datetime.now().strftime("%A, %B %d, %Y")
    )
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(formatted_prompt, request_options={"timeout": 60})
        return response.text.strip()
    except Exception as e:
        print(f"An error occurred in get_ai_tutor_response: {e}")
        return None