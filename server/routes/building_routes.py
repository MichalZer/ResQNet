from fastapi import APIRouter
from services.building_service import get_building_data

router = APIRouter()

@router.get("/")
def building():
    return get_building_data()