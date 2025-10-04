import io
import requests
import torch
import clip
import numpy as np
from fastapi import HTTPException
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

OCEAN_LABELS = [
    "a photo of a tsunami",
    "a photo of a storm surge",
    "a photo of high waves",
    "a photo of coastal currents",
    "a photo of abnormal sea behaviour",
    "a photo of a normal sea"
]

NEGATIVE_LABELS = [
    "a photo of a city street",
    "a photo of a forest",
    "a photo of a desert",
    "a photo of mountains",
    "an indoor photo"
]

ALL_LABELS = OCEAN_LABELS + NEGATIVE_LABELS
TEXT_TOKENS = clip.tokenize(ALL_LABELS).to(device)

def run_clip_inference(image_url: str) -> tuple[str, float, dict]:
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {e}")

    image_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image_tensor)
        text_features = model.encode_text(TEXT_TOKENS)
        similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)

    sim = similarity[0].cpu().numpy()
    ocean_sims = sim[:len(OCEAN_LABELS)]
    negative_sims = sim[len(OCEAN_LABELS):]

    max_ocean_idx = ocean_sims.argmax()
    max_ocean_score = float(ocean_sims[max_ocean_idx])
    max_negative_score = float(negative_sims.max())

    if max_negative_score > max_ocean_score:
        predicted_label = "not ocean related"
        confidence = max_negative_score
    else:
        predicted_label = OCEAN_LABELS[max_ocean_idx]
        confidence = max_ocean_score

    #scores_dict = {label: float(score) for label, score in zip(ALL_LABELS, sim)}
    scores_dict = {predicted_label: confidence}


    return predicted_label, confidence, scores_dict