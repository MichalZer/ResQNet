from fastapi import APIRouter
from services.simulation_service import (
    get_simulation_status,
    get_start_simulation,
    get_rescue_scores,
    get_simulation_timeline
)
router = APIRouter()

@router.post("/start")
def start():
    return get_start_simulation()


@router.get("/status")
def status():
    return get_simulation_status()


@router.get("/rescue-scores")
def scores():
    return get_rescue_scores()

@router.get("/timeline")
def timeline():
    return get_simulation_timeline()