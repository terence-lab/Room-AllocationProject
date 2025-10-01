from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import admin, allocations, imports
from .services.scheduler import init_scheduler, shutdown_scheduler
from .database import engine
from . import models

app = FastAPI(title="IoT Room Allocation System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(allocations.router, prefix="/allocations", tags=["allocations"])
app.include_router(imports.router, prefix="/imports", tags=["imports"])

@app.on_event("startup")
async def startup_event():
    # Ensure DB tables exist
    models.Base.metadata.create_all(bind=engine)
    init_scheduler()

@app.on_event("shutdown")
async def shutdown_event():
    shutdown_scheduler()

@app.get("/")
def root():
    return {"status": "ok"}
