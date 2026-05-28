from core.database import db

print("Connected successfully!")

collections = db.list_collection_names()

print("Collections: ",collections);
print("rescue-scores:" , list(db.rescue_scores.find({}, {"_id": 0})))