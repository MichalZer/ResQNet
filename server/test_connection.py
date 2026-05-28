from core.database import db

print("Connected successfully!")

collections = db.list_collection_names()

print("Collections: ",collections);