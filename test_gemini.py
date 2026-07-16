import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

try:
    models = genai.list_models()
    print("Available Models:")
    for m in models:
        print(f" - {m.name} (generateContent: {'generateContent' in m.supported_generation_methods})")
except Exception as e:
    print(f"Error listing models: {e}")
