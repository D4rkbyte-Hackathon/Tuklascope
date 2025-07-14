from typing import List, Dict
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_core import (
    get_identified_object,
    generate_spark_content,
    get_normalized_stem_skills,
    get_pathfinder_guidance,
    get_ai_tutor_response,
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
    allow_origins=["*"],  # WARNING: Restrict this to your frontend's domain in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Request Data (Data Validation) ---
# These models ensure that the data sent from your frontend is in the correct format.
class IdentificationModel(BaseModel):
    object_label: str = Field(..., description="The name of the identified object.")
    category_hint: str = Field(..., description="A hint for the object's category (e.g., Biology, Chemistry).")

class SparkContentModel(BaseModel):
    quick_facts: List[str] = Field(..., description="A list of interesting, quick facts about the object.")
    stem_concepts: List[str] = Field(..., description="A list of core STEM concepts related to the object.")
    hands_on_project: str = Field(..., description="A simple, hands-on project idea related to the object.")

class SkillModel(BaseModel):
    skill_name: str = Field(..., description="The specific name of the STEM skill learned.")
    category: str = Field(..., description="The broader STEM category for the skill (e.g., Physics, Biology).")

class SkillsResponseModel(BaseModel):
    normalized_skills: List[SkillModel]

class FullDiscoveryResponse(BaseModel):
    identification: IdentificationModel
    spark_content: SparkContentModel
    skills: SkillsResponseModel

class PathfinderRequest(BaseModel):
    user_skills: Dict[str, int] = Field(..., example={"Photosynthesis": 80, "Algebra": 70})
    grade_level: str

class PathfinderResponseModel(BaseModel):
    title: str
    summary: str
    strongest_fields: List[str]
    recommendations: List[Dict]

class TutorRequest(BaseModel):
    user_question: str
    grade_level: str
    chat_history: List[Dict[str, str]] | None = None
    object_context: str | None = None

class TutorResponse(BaseModel):
    response: str


# --- API Endpoints ---

@app.get("/", tags=["Status"])
async def root():
    """Root endpoint to check if the API is running."""
    return {"status": "Tuklascope AI API is running!"}


@app.post(
    "/api/generate-full-discovery",
    tags=["Core Feature"],
    response_model=FullDiscoveryResponse,
    summary="The primary endpoint for the discovery feature."
)
async def generate_full_discovery_endpoint(
    image: UploadFile = File(..., description="The image file uploaded by the user."),
    grade_level: str = Form(..., description="The user's current grade level (e.g., 'Junior High School').")
):
    """Handles the entire discovery process with a single, efficient API call."""
    try:
        image_bytes = await image.read()
        id_result = get_identified_object(image_bytes=image_bytes)
        if not id_result:
            raise HTTPException(status_code=503, detail="AI service failed during identification phase.")

        spark_result = generate_spark_content(object_info=id_result, grade_level=grade_level)
        if not spark_result:
            raise HTTPException(status_code=503, detail="AI service failed to generate spark content.")

        skills_result = get_normalized_stem_skills(spark_content=spark_result)
        if skills_result is None:
            raise HTTPException(status_code=503, detail="AI service failed to extract and normalize skills.")

        return {
            "identification": id_result,
            "spark_content": spark_result,
            "skills": skills_result
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"An unexpected server error occurred in discovery: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected internal server error occurred.")


@app.post(
    "/api/pathfinder",
    tags=["Supporting Features"],
    response_model=PathfinderResponseModel,
    summary="Generates personalized academic and career guidance."
)
async def get_pathfinder_guidance_endpoint(request: PathfinderRequest):
    """Provides career and academic guidance based on a user's acquired skills."""
    try:
        result = get_pathfinder_guidance(user_skills=request.user_skills, grade_level=request.grade_level)
        if not result:
            raise HTTPException(status_code=503, detail="AI Pathfinder service failed to generate guidance.")
        return result
    except Exception as e:
        print(f"An unexpected server error occurred in pathfinder: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected internal server error occurred.")


@app.post(
    "/api/tutor",
    tags=["Supporting Features"],
    response_model=TutorResponse,
    summary="Gets a conversational response from the AI Tutor."
)
async def get_tutor_response_endpoint(request: TutorRequest):
    """Handles conversational AI tutoring with context and chat history."""
    try:
        result_text = get_ai_tutor_response(
            user_question=request.user_question,
            grade_level=request.grade_level,
            chat_history=request.chat_history,
            object_context=request.object_context
        )
        if not result_text:
            raise HTTPException(status_code=503, detail="AI Tutor service failed to generate a response.")
        return {"response": result_text}
    except Exception as e:
        print(f"An unexpected server error occurred in tutor: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected internal server error occurred.")
