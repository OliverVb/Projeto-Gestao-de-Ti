"""
User Management Module
Automates user account and access management
"""
from typing import Dict, List, Optional
from src.utils import load_data, save_data, generate_id, get_current_timestamp, load_config


class UserManager:
    """Manages users and their access with automated workflows"""
    
    def __init__(self, config_path: str = "config.yaml"):
        self.config = load_config(config_path)
        self.data_file = self.config['users']['data_file']
        self.roles = self.config['users']['roles']
    
    def create_user(self, username: str, full_name: str, email: str, 
                   role: str = "User", department: str = "") -> Dict:
        """Create a new user with automated setup"""
        users = load_data(self.data_file)
        
        # Check if username already exists
        if any(u['username'] == username for u in users):
            raise ValueError(f"Username '{username}' already exists")
        
        if role not in self.roles:
            raise ValueError(f"Invalid role. Must be one of: {', '.join(self.roles)}")
        
        user = {
            "id": generate_id("USER"),
            "username": username,
            "full_name": full_name,
            "email": email,
            "role": role,
            "department": department,
            "status": "Active",
            "created_at": get_current_timestamp(),
            "last_login": None,
            "access_logs": []
        }
        
        users.append(user)
        save_data(self.data_file, users)
        
        # Auto-log account creation
        self._log_access(user['id'], f"User account created with role: {role}")
        
        return user
    
    def get_user(self, user_id: str = None, username: str = None) -> Optional[Dict]:
        """Get user by ID or username"""
        users = load_data(self.data_file)
        
        for user in users:
            if (user_id and user['id'] == user_id) or (username and user['username'] == username):
                return user
        
        return None
    
    def list_users(self, role: Optional[str] = None, status: Optional[str] = None) -> List[Dict]:
        """List users with optional filtering"""
        users = load_data(self.data_file)
        
        if role:
            users = [u for u in users if u['role'] == role]
        if status:
            users = [u for u in users if u['status'] == status]
        
        return users
    
    def update_user(self, user_id: str, **kwargs) -> Optional[Dict]:
        """Update user information"""
        users = load_data(self.data_file)
        
        for i, user in enumerate(users):
            if user['id'] == user_id:
                # Update allowed fields
                allowed_fields = ['full_name', 'email', 'role', 'department', 'status']
                changes = []
                
                for field in allowed_fields:
                    if field in kwargs and kwargs[field] != user.get(field):
                        old_value = user.get(field)
                        user[field] = kwargs[field]
                        changes.append(f"{field}: {old_value} -> {kwargs[field]}")
                
                users[i] = user
                save_data(self.data_file, users)
                
                # Auto-log changes
                if changes:
                    self._log_access(user_id, f"User updated: {', '.join(changes)}")
                
                return user
        
        return None
    
    def deactivate_user(self, user_id: str) -> Optional[Dict]:
        """Deactivate a user account (automated offboarding)"""
        user = self.update_user(user_id, status="Inactive")
        if user:
            self._log_access(user_id, "User account automatically deactivated")
        return user
    
    def activate_user(self, user_id: str) -> Optional[Dict]:
        """Activate a user account"""
        user = self.update_user(user_id, status="Active")
        if user:
            self._log_access(user_id, "User account automatically activated")
        return user
    
    def record_login(self, user_id: str) -> Optional[Dict]:
        """Record user login (automated tracking)"""
        users = load_data(self.data_file)
        
        for i, user in enumerate(users):
            if user['id'] == user_id:
                user['last_login'] = get_current_timestamp()
                users[i] = user
                save_data(self.data_file, users)
                
                self._log_access(user_id, "User logged in")
                return user
        
        return None
    
    def _log_access(self, user_id: str, action: str):
        """Internal method to log user actions (automated audit trail)"""
        users = load_data(self.data_file)
        
        for i, user in enumerate(users):
            if user['id'] == user_id:
                log_entry = {
                    "action": action,
                    "timestamp": get_current_timestamp()
                }
                user['access_logs'].append(log_entry)
                
                # Keep only last 50 logs to prevent file bloat
                if len(user['access_logs']) > 50:
                    user['access_logs'] = user['access_logs'][-50:]
                
                users[i] = user
                save_data(self.data_file, users)
                break
    
    def generate_report(self) -> Dict:
        """Generate user summary report"""
        users = load_data(self.data_file)
        
        report = {
            "total_users": len(users),
            "by_role": {},
            "by_status": {},
            "active_users": 0,
            "generated_at": get_current_timestamp()
        }
        
        for user in users:
            # Count by role
            role = user['role']
            report['by_role'][role] = report['by_role'].get(role, 0) + 1
            
            # Count by status
            status = user['status']
            report['by_status'][status] = report['by_status'].get(status, 0) + 1
            
            if status == "Active":
                report['active_users'] += 1
        
        return report
