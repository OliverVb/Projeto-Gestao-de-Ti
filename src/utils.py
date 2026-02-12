"""
Utility functions for the IT Management System
Handles configuration loading and data persistence
"""
import json
import os
from datetime import datetime
from typing import Dict, List, Any
import yaml


def load_config(config_path: str = "config.yaml") -> Dict:
    """Load configuration from YAML file"""
    with open(config_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def ensure_data_directory():
    """Ensure data directory exists"""
    if not os.path.exists('data'):
        os.makedirs('data')


def load_data(file_path: str) -> List[Dict]:
    """Load data from JSON file"""
    ensure_data_directory()
    if not os.path.exists(file_path):
        return []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []


def save_data(file_path: str, data: List[Dict]):
    """Save data to JSON file"""
    ensure_data_directory()
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def generate_id(prefix: str = "ID") -> str:
    """Generate a unique ID with timestamp and microseconds"""
    import time
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    microseconds = int(time.time() * 1000000) % 1000000
    return f"{prefix}-{timestamp}{microseconds:06d}"


def format_datetime(dt: datetime = None) -> str:
    """Format datetime for display"""
    if dt is None:
        dt = datetime.now()
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def get_current_timestamp() -> str:
    """Get current timestamp as string"""
    return format_datetime()
