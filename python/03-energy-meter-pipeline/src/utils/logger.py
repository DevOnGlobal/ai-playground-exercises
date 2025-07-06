import logging
import sys

def setup_logging():
    logging.basicConfig(level=logging.INFO, stream=sys.stdout, format='%(asctime)s - %(levelname)s - %(message)s')

def log_user_activity(user_data, action):
    logging.info(f"User activity: {user_data} - Action: {action}")
