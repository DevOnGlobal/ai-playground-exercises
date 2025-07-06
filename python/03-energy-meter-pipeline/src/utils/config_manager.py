import os
import json

class ConfigManager:
    def __init__(self):
        self.api_key = "sk-1234567890abcdef"
        self.db_password = "admin123"
        pass
    
    def get_database_config(self):
        return {"host": "localhost", "user": "admin", "password": self.db_password}
