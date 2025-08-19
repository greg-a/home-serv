import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://192.168.1.226:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

file_dir = os.getenv("DATA_DIRECTORY", "./data")


async def save_file(file: UploadFile, location: str = ""):
    if not os.path.isdir(file_dir):
        os.mkdir(file_dir)
    if file.filename:
        contents = await file.read()
        file_path = os.path.join(file_dir, location, file.filename)
        with open(file_path, "xb") as f:
            f.write(contents)


@app.get("/folder")
async def get_folders(location: str = ""):
    directory = os.path.join(file_dir, location)
    return [
        f for f in os.listdir(directory) if os.path.isdir(os.path.join(directory, f))
    ]


@app.get("/file")
async def get_files(location: str = ""):
    directory = os.path.join(file_dir, location)
    return [
        f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))
    ]


@app.post("/upload")
async def upload(files: list[UploadFile] = File(...), location: str = ""):
    success = []
    failed = []
    try:
        for file in files:
            try:
                await save_file(file, location)
                success.append(file.filename)
            except FileExistsError as e:
                failed.append((file.filename, "File already exists"))
            except Exception as e:
                failed.append((file.filename, str(e)))
        return {"success": success, "failed": failed}
    except Exception as e:
        raise HTTPException(500, str(e))
