from fastapi import APIRouter
from services.signals_service import get_signals_data

router = APIRouter()

@router.get("/")
def signals():
    return get_signals_data()