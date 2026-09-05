import requests
import json
import base64

res = requests.post("http://127.0.0.1:8000/api/voice/chat", json={
    "message": "Salom Mohira! IT sohasida qanday kasblar bor?",
    "userName": "Farhodjon",
    "userAge": 23
})

print("Status:", res.status_code)
data = res.json()
print("Reply text:", data.get("reply"))
audio = data.get("audioBase64")
if audio:
    print("Audio received! Length of base64 audio:", len(audio))
else:
    print("No audio received")
