"""
Monitoring Module
Automates system monitoring and reporting
"""
from typing import Dict, List, Optional
from src.utils import load_data, save_data, generate_id, get_current_timestamp, load_config


class SystemMonitor:
    """Automates system monitoring and health checks"""
    
    def __init__(self, config_path: str = "config.yaml"):
        self.config = load_config(config_path)
        self.data_file = self.config['monitoring']['data_file']
        self.check_interval = self.config['monitoring']['check_interval']
    
    def record_check(self, system_name: str, check_type: str, status: str,
                    metrics: Dict = None, message: str = "") -> Dict:
        """Record a system health check"""
        checks = load_data(self.data_file)
        
        check = {
            "id": generate_id("CHECK"),
            "system_name": system_name,
            "check_type": check_type,
            "status": status,  # OK, WARNING, ERROR
            "metrics": metrics or {},
            "message": message,
            "timestamp": get_current_timestamp()
        }
        
        checks.append(check)
        
        # Auto-alert on errors
        if status == "ERROR":
            check['alert_sent'] = True
            check['alert_message'] = f"ALERT: {system_name} - {check_type} failed: {message}"
        else:
            check['alert_sent'] = False
            check['alert_message'] = None
        
        save_data(self.data_file, checks)
        return check
    
    def get_latest_checks(self, system_name: Optional[str] = None, limit: int = 10) -> List[Dict]:
        """Get latest health checks"""
        checks = load_data(self.data_file)
        
        if system_name:
            checks = [c for c in checks if c['system_name'] == system_name]
        
        # Sort by timestamp (most recent first)
        checks.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return checks[:limit]
    
    def get_system_status(self, system_name: str) -> Dict:
        """Get current status of a system"""
        checks = self.get_latest_checks(system_name, limit=1)
        
        if not checks:
            return {
                "system_name": system_name,
                "status": "UNKNOWN",
                "message": "No checks recorded",
                "last_check": None
            }
        
        latest = checks[0]
        return {
            "system_name": system_name,
            "status": latest['status'],
            "message": latest['message'],
            "last_check": latest['timestamp'],
            "metrics": latest.get('metrics', {})
        }
    
    def get_all_systems_status(self) -> List[Dict]:
        """Get status of all monitored systems"""
        checks = load_data(self.data_file)
        
        # Get unique system names
        systems = set(c['system_name'] for c in checks)
        
        return [self.get_system_status(sys) for sys in systems]
    
    def get_alerts(self, limit: int = 20) -> List[Dict]:
        """Get recent alerts (automated alert system)"""
        checks = load_data(self.data_file)
        
        # Filter only checks with alerts
        alerts = [c for c in checks if c.get('alert_sent', False)]
        
        # Sort by timestamp (most recent first)
        alerts.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return alerts[:limit]
    
    def generate_report(self) -> Dict:
        """Generate monitoring summary report"""
        checks = load_data(self.data_file)
        
        report = {
            "total_checks": len(checks),
            "by_status": {},
            "total_alerts": 0,
            "monitored_systems": 0,
            "generated_at": get_current_timestamp()
        }
        
        systems = set()
        
        for check in checks:
            # Count by status
            status = check['status']
            report['by_status'][status] = report['by_status'].get(status, 0) + 1
            
            # Count alerts
            if check.get('alert_sent', False):
                report['total_alerts'] += 1
            
            # Track unique systems
            systems.add(check['system_name'])
        
        report['monitored_systems'] = len(systems)
        
        return report
