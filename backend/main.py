from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io
import openai

app = FastAPI()

