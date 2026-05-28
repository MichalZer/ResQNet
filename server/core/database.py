from pymongo import MongoClient

#client = MongoClient("mongodb://localhost:27017")
#client = MongoClient("mongodb+srv://tamarmosko:%3Ctamar123%3E@resqnet.x2kifoo.mongodb.net/")
# client = MongoClient(
#     "mongodb+srv://tamarmosko:tamar123@resqnet.x2kifoo.mongodb.net/"
# )
client = MongoClient(
    "mongodb+srv://tamarmosko:tamar123@resqnet.x2kifoo.mongodb.net/?retryWrites=true&w=majority"
)

db = client["resqnet"]