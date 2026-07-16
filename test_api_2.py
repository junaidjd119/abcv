import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

try:
    print("Testing gemini-2.0-flash ...")
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    response = model.generate_content("Hello")
    print("Response:", response.text)
except Exception as e:
    print("Error 2.0-flash:", type(e).__name__, str(e))

try:
    print("\nTesting gemini-flash-latest ...")
    model2 = genai.GenerativeModel('models/gemini-flash-latest')
    response2 = model2.generate_content("Hello")
    print("Response:", response2.text)
except Exception as e:
    print("Error flash-latest:", type(e).__name__, str(e))
