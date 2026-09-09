from datetime import datetime, timezone
from pathlib import Path

import atlasopenmagic as atom
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(
    title="ATLAS Reproducible Analysis API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisRequest(BaseModel):
    dataset_id: str = "301204"
    release: str = "2024r-pp"
    max_events: int = 20000


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "atlas-analysis-api",
    }


@app.get("/dataset/{dataset_id}")
def get_dataset(dataset_id: str):
    atom.set_release("2024r-pp")

    metadata = atom.get_metadata(dataset_id)

    return {
        "dataset_id": dataset_id,
        "metadata": metadata,
    }


@app.post("/analysis")
def run_analysis(request: AnalysisRequest):

    atom.set_release(request.release)

    metadata = atom.get_metadata(
        request.dataset_id
    )

    urls = atom.get_urls(
        request.dataset_id
    )

    local_files = list(
        Path("../../data").glob("*")
    )

    manifest = {
        "dataset": {
            "id": request.dataset_id,
            "release": request.release,
        },
        "parameters": {
            "max_events": request.max_events,
        },
        "data": {
            "remote_files_found": len(urls),
            "local_files_found": len(local_files),
        },
        "software": {
            "atlasopenmagic": getattr(
                atom,
                "__version__",
                "unknown",
            ),
        },
        "created_at": datetime.now(
            timezone.utc
        ).isoformat(),
    }

    return {
        "status": "completed",
        "dataset_id": request.dataset_id,
        "release": request.release,
        "events_processed": request.max_events,
        "metadata_available": bool(metadata),
        "remote_files_found": len(urls),
        "local_files_found": len(local_files),
        "manifest": manifest,
    }
