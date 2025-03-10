from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routing import survivors, infection, items
from .database import initialize_db


# Initialize database on startup
@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_db()
    yield


app = FastAPI(
    title="ZSSN API",
    description="An API for the Zombie Survival Social Network",
    version="0.1.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(survivors.router, prefix="/survivors")
app.include_router(infection.router, prefix="/survivors")
app.include_router(items.router, prefix="/survivors")


@app.get("/")
async def root():
    return {"message": "Welcome to the end of the world"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
