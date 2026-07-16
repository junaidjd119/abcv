import os
import csv
import time
import random
import subprocess
from pathlib import Path

DOWNLOADS_DIR = Path("downloads")
OUTPUT_DIR = Path("completed_videos")
REPORT_FILE = "processing_report.csv"
OUTPUT_DIR.mkdir(exist_ok=True)

SCRIPTS = {
    "abs": [
        "Keep your core tight! Let's crush this set. Breathe out as you contract, and feel the burn in your abs. You've got this!",
        "Focus on your midsection. Contract those core muscles hard. Every rep brings you closer to your goals. Let's push through!",
        "Engage your core completely! Keep your back straight and make every single movement count. Build that iron core right now!"
    ],
    "arm": [
        "Let's build those arms! Squeeze at the top of the movement and control the weight on the way down. Pure power!",
        "Focus on the contraction. Flex those arm muscles hard. Keep your elbows locked in and let the muscles do the work!",
        "Time to blast those arms! Push through the burn, keep your form strict, and explode with power. You are doing great!"
    ],
    "back": [
        "Pull with your back, not your arms! Squeeze your shoulder blades together. Build that strong, wide back. Let's go!",
        "Engage your lats and keep your spine neutral. Focus on the pull and control the release. Powerful back movements!",
        "Keep your chest up and squeeze the back muscles hard. Every rep makes you stronger. Let's conquer this back workout!"
    ],
    "butt": [
        "Squeeze the glutes at the top! Drive through your heels and feel the power in your lower body. Let's sculpt those glutes!",
        "Focus on the glute contraction. Keep your core engaged and push through the burn. Build that lower body strength!",
        "Activate those glutes! Smooth and controlled movements. Feel the burn and push past your limits. You are unstoppable!"
    ],
    "shoulders": [
        "Push it straight up! Keep your core tight and shoulders engaged. Build those boulder shoulders with perfect form. Let's go!",
        "Control the weight on the way down. Isolate those shoulder muscles. Breathe and execute with perfect precision!",
        "Let's blast those shoulders! Keep your posture strong and focus on the muscle connection. Push through the burn!"
    ],
    "stretching": [
        "Deep breaths. Sink into the stretch and let your muscles relax. Hold it there and feel the tension melting away.",
        "Focus on your breathing. Keep your body relaxed and gently push the stretch a little further. Great for recovery!",
        "Smooth, dynamic movements. Loosen up those joints and prepare your body. Keep breathing and stay relaxed."
    ],
    "triceps": [
        "Lock out at the end! Squeeze those triceps hard. Control the negative and explode with power. Let's build those arms!",
        "Isolate the triceps! Keep your elbows stationary and push through the burn. Perfect form equals perfect results!",
        "Focus entirely on the back of the arms. Contract the triceps fully on every single rep. You're crushing it!"
    ],
    "warmup": [
        "Let's get the blood flowing! Keep your movements dynamic and get your body ready for action. Breathe deeply!",
        "Warm up those joints and muscles. Keep a steady pace and focus on preparing your body for the workout ahead.",
        "Dynamic movements to start the engine! Stay light on your feet and keep breathing. Let's get ready to work!"
    ],
    "default": [
        "Keep your form strict! Focus on the working muscle and breathe through every single rep. You are doing amazing!",
        "Stay strong and keep pushing! Control the movement and feel the power in your body. Let's crush this workout!",
        "Maintain perfect technique. Engage your muscles and push past your limits. Every rep makes you stronger today!"
    ]
}

def get_duration(file_path):
    cmd = [
        'ffprobe', '-v', 'error', '-show_entries',
        'format=duration', '-of',
        'default=noprint_wrappers=1:nokey=1', str(file_path)
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    try:
        return float(result.stdout)
    except:
        return 0.0

def generate_tts(text, output_path):
    cmd = [
        "py", "-m", "edge_tts",
        "--voice", "en-US-BrianNeural",
        "--rate", "+15%",
        "--text", text,
        "--write-media", str(output_path)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT, check=True)

def merge_audio_video(video_path, audio_path, output_path, v_dur, a_dur):
    cmd = [
        "ffmpeg", "-y",
        "-i", str(video_path),
        "-i", str(audio_path),
        "-map", "0:v", "-map", "1:a",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        str(output_path)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)

def write_csv_row(row):
    for attempt in range(5):
        try:
            with open(REPORT_FILE, "a", newline="", encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(row)
            break
        except PermissionError:
            print("  ! WARNING: Please close processing_report.csv! Retrying in 2s...")
            time.sleep(2)

def get_script_for_video(video_path):
    path_lower = str(video_path).lower()
    for category in SCRIPTS.keys():
        if category != "default" and category in path_lower:
            return random.choice(SCRIPTS[category]), category.upper()
    return random.choice(SCRIPTS["default"]), "GENERAL"

def main():
    if not os.path.exists(REPORT_FILE):
        with open(REPORT_FILE, "w", newline="", encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["File", "Status", "Category", "Time Taken", "Error"])
            
    completed = set()
    if os.path.exists(REPORT_FILE):
        with open(REPORT_FILE, "r", encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                if row[1] == "SUCCESS":
                    completed.add(row[0])

    mp4_files = list(DOWNLOADS_DIR.rglob("*.mp4"))
    total_files = len(mp4_files)
    print(f"Found {total_files} videos to process using Offline Mode.")

    for i, video_path in enumerate(mp4_files, 1):
        rel_path = video_path.relative_to(DOWNLOADS_DIR)
        output_video_path = OUTPUT_DIR / rel_path
        
        if str(video_path) in completed:
            print(f"[{i}/{total_files}] Skipping already processed: {rel_path}")
            continue
            
        print(f"\n[{i}/{total_files}] Processing: {rel_path}")
        start_time = time.time()
        
        output_video_path.parent.mkdir(parents=True, exist_ok=True)
        temp_audio = OUTPUT_DIR / "temp_audio.mp3"
        
        try:
            v_dur = get_duration(video_path)
            if v_dur == 0:
                raise Exception("Could not read video duration.")
                
            script_text, category = get_script_for_video(video_path)
            print(f"  -> Category: {category} | Generating TTS Audio...")
            
            generate_tts(script_text, temp_audio)
            a_dur = get_duration(temp_audio)
            if a_dur == 0.0:
                raise Exception("Failed to generate valid TTS audio.")
            
            print(f"  -> Merging Audio (No Text Overlay)...")
            merge_audio_video(video_path, temp_audio, output_video_path, v_dur, a_dur)
            
            if temp_audio.exists():
                temp_audio.unlink()
                
            elapsed = time.time() - start_time
            print(f"  -> SUCCESS in {elapsed:.1f}s")
            write_csv_row([str(video_path), "SUCCESS", category, f"{elapsed:.1f}s", ""])
            
            # No API limits! Running at maximum speed.
            
        except Exception as e:
            elapsed = time.time() - start_time
            print(f"  -> FAILED: {str(e)}")
            write_csv_row([str(video_path), "FAILED", "", f"{elapsed:.1f}s", str(e)])
                
            if temp_audio.exists():
                temp_audio.unlink()

if __name__ == "__main__":
    main()
