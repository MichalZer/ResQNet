from fastapi import FastAPI

from routes.building_routes import router as building_router
from routes.signals_routes import router as signals_router
from routes.simulation_routes import router as simulation_router

app = FastAPI()
app.include_router(building_router, prefix="/building")
app.include_router(signals_router, prefix="/signals")
app.include_router(simulation_router, prefix="/simulation")


@app.get("/")
def root():
    return {"message": "ResQNet Server Running"}