import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

try:
    print("Testing gemini-3.5-flash with simple text...")
    model = genai.GenerativeModel('models/gemini-3.5-flash')
    response = model.generate_content("Hello, this is a test. Reply with 'OK' if you get this.")
    print("Response:", response.text)
except Exception as e:
    print("Error:", type(e).__name__, str(e))

try:
    print("\nTesting gemini-2.5-flash with simple text...")
    model2 = genai.GenerativeModel('models/gemini-2.5-flash')
    response2 = model2.generate_content("Hello, this is a test. Reply with 'OK' if you get this.")
    print("Response:", response2.text)
except Exception as e:
    print("Error:", type(e).__name__, str(e))
