# In ai_functions/app.py

import os
import shutil
from typing import List, Dict, Optional, Any

# --- FastAPI Imports ---
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field # Used for data validation

# --- Your AI Core Functions ---
from ai_core import (
    get_identified_object,
    generate_spark_content,
    get_normalized_stem_skills,
    get_pathfinder_guidance,
    get_ai_tutor_response
)

# --- Initialize FastAPI App ---
app = FastAPI(
    title="Tuklascope AI API",
    description="API for all AI-powered features of the Tuklascope platform.",
    version="1.0.0"
)

# --- CORS Middleware ---
# This allows your React frontend (running on a different port) to communicate with this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you should restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Request Data (Data Validation) ---
# These models ensure that the data sent from your frontend is in the correct format.

class SparkContentRequest(BaseModel):
    object_info: Dict[str, str] = Field(..., example={"object_label": "Leaf", "category_hint": "Biology"})
    grade_level: str = Field(..., example="Junior High School")

class SkillRequest(BaseModel):
    spark_content: Dict[str, Any]

class PathfinderRequest(BaseModel):
    user_skills: Dict[str, int] = Field(..., example={"Photosynthesis": 80, "Algebra": 70})
    grade_level: str

class TutorRequest(BaseModel):
    user_question: str
    grade_level: str
    chat_history: Optional[List[Dict[str, str]]] = None
    object_context: Optional[str] = None


# --- API Endpoints ---

@app.get("/", tags=["Status"])
async def root():
    """Root endpoint to check if the API is running."""
    return {"status": "Tuklascope AI API is running!"}


@app.post("/api/identify", tags=["1. Discovery"])
async def identify_object_endpoint(image: UploadFile = File(...)):
    """
    Identifies the main object in an uploaded image.
    """
    temp_dir = "temp_images"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, image.filename)

    try:
        # Save the uploaded file temporarily
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Call your AI function
        result = get_identified_object(image_path=temp_path)
        if not result:
            raise HTTPException(status_code=500, detail="Failed to identify object from AI model.")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/api/spark", tags=["2. Spark Content"])
async def generate_spark_content_endpoint(request: SparkContentRequest):
    """
    Generates educational 'Spark' content for a given object and grade level.
    """
    result = generate_spark_content(object_info=request.object_info, grade_level=request.grade_level)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to generate spark content.")
    return result


@app.post("/api/skills", tags=["3. Skill Tree"])
async def extract_skills_endpoint(request: SkillRequest):
    """
    Extracts and normalizes STEM skills from generated Spark content.
    """
    result = get_normalized_stem_skills(spark_content=request.spark_content)
    if result is None: # Can return empty list, so check for None
        raise HTTPException(status_code=500, detail="Failed to extract skills.")
    return {"normalized_skills": result}


@app.post("/api/pathfinder", tags=["4. Pathfinder AI"])
async def get_pathfinder_guidance_endpoint(request: PathfinderRequest):
    """
    Generates personalized academic and career guidance.
    """
    result = get_pathfinder_guidance(user_skills=request.user_skills, grade_level=request.grade_level)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to get pathfinder guidance.")
    return result


@app.post("/api/tutor", tags=["5. AI Tutor"])
async def get_tutor_response_endpoint(request: TutorRequest):
    """
    Gets a conversational response from the AI Tutor.
    """
    result = get_ai_tutor_response(
        user_question=request.user_question,
        grade_level=request.grade_level,
        chat_history=request.chat_history,
        object_context=request.object_context
    )
    if not result:
        raise HTTPException(status_code=500, detail="Failed to get tutor response.")
    return {"response": result}