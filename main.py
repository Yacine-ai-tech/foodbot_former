from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from langdetect import detect
from fastapi.middleware.cors import CORSMiddleware
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your allowed domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load models at startup to optimize performance
intent_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
ner_model = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

# Pydantic models for request bodies
class IntentRequest(BaseModel):
    text: str

class NerRequest(BaseModel):
    text: str

@app.post("/nlp/intent")
async def get_intent(request: IntentRequest):
    text = request.text
    language = detect(text)
    if language != 'en':
        raise HTTPException(status_code=422, detail="Language not supported")
    
    result = intent_classifier(text, candidate_labels=["Order Food", "Check Status"])
    logger.info(f"Intent detected: {result['labels'][0]} for text: {text}")
    return {"intent": result['labels'][0]}

@app.post("/nlp/ner")
async def get_entities(request: NerRequest):
    text = request.text
    language = detect(text)
    if language != 'en':
        raise HTTPException(status_code=422, detail="Language not supported")
    
    result = ner_model(text)
    entities = [{"entity": entity["word"], "label": entity["entity_group"]} for entity in result]
    logger.info(f"Entities detected: {entities} for text: {text}")
    return {"entities": entities}
