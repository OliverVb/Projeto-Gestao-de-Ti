"""
Ticket Management Module
Automates incident and service request tracking
"""
from typing import Dict, List, Optional
from src.utils import load_data, save_data, generate_id, get_current_timestamp, load_config


class TicketManager:
    """Manages IT tickets with automated workflows"""
    
    def __init__(self, config_path: str = "config.yaml"):
        self.config = load_config(config_path)
        self.data_file = self.config['tickets']['data_file']
        self.priorities = self.config['tickets']['priorities']
        self.statuses = self.config['tickets']['statuses']
    
    def create_ticket(self, title: str, description: str, priority: str = "Medium",
                     requester: str = "", assigned_to: str = "") -> Dict:
        """Create a new ticket"""
        tickets = load_data(self.data_file)
        
        if priority not in self.priorities:
            raise ValueError(f"Invalid priority. Must be one of: {', '.join(self.priorities)}")
        
        ticket = {
            "id": generate_id("TICKET"),
            "title": title,
            "description": description,
            "priority": priority,
            "status": "Open",
            "requester": requester,
            "assigned_to": assigned_to,
            "created_at": get_current_timestamp(),
            "updated_at": get_current_timestamp(),
            "resolved_at": None,
            "comments": []
        }
        
        tickets.append(ticket)
        save_data(self.data_file, tickets)
        
        # Auto-assign based on priority (automation logic)
        if priority == "Critical" and not assigned_to:
            self._auto_escalate(ticket['id'])
        
        return ticket
    
    def get_ticket(self, ticket_id: str) -> Optional[Dict]:
        """Get ticket by ID"""
        tickets = load_data(self.data_file)
        for ticket in tickets:
            if ticket['id'] == ticket_id:
                return ticket
        return None
    
    def list_tickets(self, status: Optional[str] = None, priority: Optional[str] = None,
                    assigned_to: Optional[str] = None) -> List[Dict]:
        """List tickets with optional filtering"""
        tickets = load_data(self.data_file)
        
        if status:
            tickets = [t for t in tickets if t['status'] == status]
        if priority:
            tickets = [t for t in tickets if t['priority'] == priority]
        if assigned_to:
            tickets = [t for t in tickets if t['assigned_to'] == assigned_to]
        
        return tickets
    
    def update_ticket_status(self, ticket_id: str, status: str) -> Optional[Dict]:
        """Update ticket status with automated workflow"""
        if status not in self.statuses:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(self.statuses)}")
        
        tickets = load_data(self.data_file)
        
        for i, ticket in enumerate(tickets):
            if ticket['id'] == ticket_id:
                old_status = ticket['status']
                ticket['status'] = status
                ticket['updated_at'] = get_current_timestamp()
                
                # Auto-set resolved timestamp
                if status in ["Resolved", "Closed"] and not ticket['resolved_at']:
                    ticket['resolved_at'] = get_current_timestamp()
                
                # Add automated comment
                comment = {
                    "text": f"Status automatically changed from {old_status} to {status}",
                    "author": "System",
                    "timestamp": get_current_timestamp()
                }
                ticket['comments'].append(comment)
                
                tickets[i] = ticket
                save_data(self.data_file, tickets)
                return ticket
        
        return None
    
    def assign_ticket(self, ticket_id: str, assigned_to: str) -> Optional[Dict]:
        """Assign ticket to a technician"""
        tickets = load_data(self.data_file)
        
        for i, ticket in enumerate(tickets):
            if ticket['id'] == ticket_id:
                ticket['assigned_to'] = assigned_to
                ticket['updated_at'] = get_current_timestamp()
                
                # Auto-update status
                if ticket['status'] == "Open":
                    ticket['status'] = "In Progress"
                
                # Add automated comment
                comment = {
                    "text": f"Ticket automatically assigned to {assigned_to}",
                    "author": "System",
                    "timestamp": get_current_timestamp()
                }
                ticket['comments'].append(comment)
                
                tickets[i] = ticket
                save_data(self.data_file, tickets)
                return ticket
        
        return None
    
    def add_comment(self, ticket_id: str, text: str, author: str = "User") -> Optional[Dict]:
        """Add a comment to a ticket"""
        tickets = load_data(self.data_file)
        
        for i, ticket in enumerate(tickets):
            if ticket['id'] == ticket_id:
                comment = {
                    "text": text,
                    "author": author,
                    "timestamp": get_current_timestamp()
                }
                ticket['comments'].append(comment)
                ticket['updated_at'] = get_current_timestamp()
                
                tickets[i] = ticket
                save_data(self.data_file, tickets)
                return ticket
        
        return None
    
    def _auto_escalate(self, ticket_id: str):
        """Automatically escalate critical tickets (internal automation)"""
        comment = {
            "text": "CRITICAL ticket automatically escalated to senior technician",
            "author": "System",
            "timestamp": get_current_timestamp()
        }
        self.add_comment(ticket_id, comment['text'], comment['author'])
    
    def generate_report(self) -> Dict:
        """Generate ticket summary report"""
        tickets = load_data(self.data_file)
        
        report = {
            "total_tickets": len(tickets),
            "by_status": {},
            "by_priority": {},
            "open_tickets": 0,
            "average_resolution_time": "N/A",
            "generated_at": get_current_timestamp()
        }
        
        for ticket in tickets:
            # Count by status
            status = ticket['status']
            report['by_status'][status] = report['by_status'].get(status, 0) + 1
            
            # Count by priority
            priority = ticket['priority']
            report['by_priority'][priority] = report['by_priority'].get(priority, 0) + 1
            
            # Count open tickets
            if status in ["Open", "In Progress"]:
                report['open_tickets'] += 1
        
        return report
