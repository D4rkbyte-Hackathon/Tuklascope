def identify_object_prompt(image_data):
    return [
        f"""
Analyze this image and identify the single, most prominent object.
Your response must be a single, valid JSON object with two keys: "object_name" and "category".

RULES:
- "object_name" should be the common name of the object.
- "category" should be a simple, clarifying category (e.g., "Animal", "Food", "Computer Peripheral", "Tool").

Example 1: For an image of a house mouse.
Response: {{"object_name": "mouse", "category": "Animal"}}

Example 2: For an image of a computer mouse.
Response: {{"object_name": "mouse", "category": "Computer Peripheral"}}

Example 3: For an image of a mango.
Response: {{"object_name": "mango", "category": "Food"}}

Do not include any text or formatting outside of the single JSON object.
""",
        image_data
    ]


def generate_learning_cards_prompt(object_name, category, grade_level):
    return f"""
You are an expert Filipino educator and STEM advocate. Your goal is to make science fun and accessible for a {grade_level} student in the Philippines.

An object has been identified:
- **Object Name:** {object_name}
- **Category:** {category}

Generate three distinct educational cards about this object in a JSON format. The keys for the JSON object must be "quick_facts", "stem_concepts", and "home_project".

Here are the details for each card:

1.  **"quick_facts"**:
    * Provide a brief, one-paragraph introduction to the object. It must include at least one surprising fun fact.
    * Tailor the tone for a {grade_level} student.
    * Use Filipino context where possible.

2.  **"stem_concepts"**:
    * Explain ONLY one core STEM concept related to the object.
    * Tailor the explanation for a {grade_level} student's understanding.

3.  **"home_project"**:
    * Describe a simple, safe, at-home project or experiment the student can do.
    * The project must use common household materials found in a typical Filipino home.
    * Provide clear, step-by-step instructions.

The final output must be a single, valid JSON object with the three specified keys. Do not include any text or formatting outside of the JSON object.
Use the ENGLISH LANGUAGE for now
"""


def get_skill_tag_prompt(generated_text):
    return f"""
Analyze the following text and extract a list of up to 5 relevant STEM fields or concepts.

RULES:
- Respond with only a Python list of strings.
- Focus on scientific fields (e.g., 'Physics', 'Biology', 'Chemistry').
- Also include specific concepts if they are prominent (e.g., 'Photosynthesis', 'Electromagnetism').
- Do not include more than 5 items.

TEXT TO ANALYZE:
---
{generated_text}
---

Example Response:
['Chemistry', 'Biology', 'Nutrition', 'Botany']
"""