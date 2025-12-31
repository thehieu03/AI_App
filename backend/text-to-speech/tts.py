import io
import os
import sys
from typing import Optional
import uuid 
import modal
from pydantic import BaseModel
import torch 
import torchaudio

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install("numpy==1.26.0","torch==2.6.0")
    .pip_install_from_requirements("requirements.txt")
    .apt_install("ffmpeg")
)

volume=modal.volume.from_name("hf-cache-ai-voice-studio",create_if_missing=True);

s3_secret=modal.Secret.from_name("s3-secret-ai-voice-studio");