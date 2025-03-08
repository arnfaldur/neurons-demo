from fastapi import FastAPI

app = FastAPI(title="ZSSN API", description="An API for the Zombie Survival Social Network", version="0.1.0")

@app.get("/")
async def root():
    return {"message": "Welcome to the end of the world"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
