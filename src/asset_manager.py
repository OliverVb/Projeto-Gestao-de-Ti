"""
Asset Management Module
Automates tracking and management of IT assets (hardware and software)
"""
from typing import Dict, List, Optional
from src.utils import load_data, save_data, generate_id, get_current_timestamp, load_config


class AssetManager:
    """Manages IT assets with automated tracking"""
    
    def __init__(self, config_path: str = "config.yaml"):
        self.config = load_config(config_path)
        self.data_file = self.config['assets']['data_file']
        self.categories = self.config['assets']['categories']
    
    def add_asset(self, name: str, category: str, description: str = "", 
                  serial_number: str = "", location: str = "") -> Dict:
        """Add a new asset to inventory"""
        assets = load_data(self.data_file)
        
        if category not in self.categories:
            raise ValueError(f"Invalid category. Must be one of: {', '.join(self.categories)}")
        
        asset = {
            "id": generate_id("ASSET"),
            "name": name,
            "category": category,
            "description": description,
            "serial_number": serial_number,
            "location": location,
            "status": "Active",
            "created_at": get_current_timestamp(),
            "updated_at": get_current_timestamp()
        }
        
        assets.append(asset)
        save_data(self.data_file, assets)
        return asset
    
    def get_asset(self, asset_id: str) -> Optional[Dict]:
        """Get asset by ID"""
        assets = load_data(self.data_file)
        for asset in assets:
            if asset['id'] == asset_id:
                return asset
        return None
    
    def list_assets(self, category: Optional[str] = None, status: Optional[str] = None) -> List[Dict]:
        """List all assets with optional filtering"""
        assets = load_data(self.data_file)
        
        if category:
            assets = [a for a in assets if a['category'] == category]
        if status:
            assets = [a for a in assets if a['status'] == status]
        
        return assets
    
    def update_asset(self, asset_id: str, **kwargs) -> Optional[Dict]:
        """Update asset information"""
        assets = load_data(self.data_file)
        
        for i, asset in enumerate(assets):
            if asset['id'] == asset_id:
                # Update allowed fields
                allowed_fields = ['name', 'description', 'serial_number', 'location', 'status']
                for field in allowed_fields:
                    if field in kwargs:
                        asset[field] = kwargs[field]
                
                asset['updated_at'] = get_current_timestamp()
                assets[i] = asset
                save_data(self.data_file, assets)
                return asset
        
        return None
    
    def delete_asset(self, asset_id: str) -> bool:
        """Delete an asset"""
        assets = load_data(self.data_file)
        original_length = len(assets)
        assets = [a for a in assets if a['id'] != asset_id]
        
        if len(assets) < original_length:
            save_data(self.data_file, assets)
            return True
        return False
    
    def generate_report(self) -> Dict:
        """Generate asset summary report"""
        assets = load_data(self.data_file)
        
        report = {
            "total_assets": len(assets),
            "by_category": {},
            "by_status": {},
            "generated_at": get_current_timestamp()
        }
        
        for asset in assets:
            # Count by category
            category = asset['category']
            report['by_category'][category] = report['by_category'].get(category, 0) + 1
            
            # Count by status
            status = asset['status']
            report['by_status'][status] = report['by_status'].get(status, 0) + 1
        
        return report
