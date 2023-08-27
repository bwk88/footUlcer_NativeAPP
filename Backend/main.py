
from fastapi import FastAPI, File, UploadFile
import json
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("C:/Users/Asus/Desktop/DFU_MobileApp/my_model.h5")
CLASS_NAMES = ["Non-Ulcer", "Ulcer"]


@app.get("/ping")
async def ping():
    return "Hello, I am alive"


# def read_file(data) -> np.ndarray:
#     image = np.array(Image.open(BytesIO(data)))
#     print(image.shape)
#     return image


input_shape = (224, 224, 3)
num_classes = 1


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # image = read_file(await file.read())
    # # img_batch = np.expand_dims(image, 0)
    # prediction = MODEL.predict(image)
    # pass
    # # data = json.loads(file.file.read())
    # # return {"content":data, "fileName":file.filename}

    # Read the uploaded image file
    image = Image.open(file.file)

    # Preprocess the image
    image = image.resize(input_shape[:2])
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)

    # Make a prediction using the loaded model
    prediction = model.predict(image)

    # Return the predicted class (0 for non-ulcer, 1 for ulcer)
    predicted_class = int(prediction > 0.5)
    return {'class': CLASS_NAMES[predicted_class],
            'confidence': float(prediction)}

if __name__ == '__main__':
    uvicorn.run(app, host='localhost', port=8002)