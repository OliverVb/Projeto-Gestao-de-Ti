# Quick Reference Guide - IT Management Automation System

## Installation
```bash
pip install -r requirements.txt
```

## Common Commands

### Asset Management
```bash
# Add asset
python itmanager.py asset add --name "NAME" --category "CATEGORY" --location "LOCATION"

# List assets
python itmanager.py asset list
python itmanager.py asset list --category "Server"
python itmanager.py asset list --status "Active"

# Generate report
python itmanager.py asset report
```

### Ticket Management
```bash
# Create ticket
python itmanager.py ticket create --title "TITLE" --description "DESC" --priority "High"

# List tickets
python itmanager.py ticket list
python itmanager.py ticket list --status "Open"
python itmanager.py ticket list --priority "Critical"

# Assign ticket (automatically changes status to "In Progress")
python itmanager.py ticket assign --ticket-id "TICKET-ID" --assign "Technician Name"

# Update ticket status
python itmanager.py ticket update --ticket-id "TICKET-ID" --new-status "Resolved"

# Generate report
python itmanager.py ticket report
```

### User Management
```bash
# Create user
python itmanager.py user create --username "USER" --fullname "Full Name" --email "EMAIL" --role "Admin"

# List users
python itmanager.py user list
python itmanager.py user list --role "Admin"
python itmanager.py user list --status "Active"

# Deactivate user (automated offboarding)
python itmanager.py user deactivate --user-id "USER-ID"

# Generate report
python itmanager.py user report
```

### System Monitoring
```bash
# Record health check
python itmanager.py monitor check --system "Web Server" --check-type "HTTP" --status "OK" --message "All good"

# Check system status
python itmanager.py monitor status
python itmanager.py monitor status --system "Web Server"

# View alerts (automatically generated for ERROR status)
python itmanager.py monitor alerts

# Generate report
python itmanager.py monitor report
```

## Valid Values

### Asset Categories
- Desktop
- Laptop
- Server
- Network Device
- Mobile Device
- Software License

### Ticket Priorities
- Low
- Medium
- High
- Critical

### Ticket Statuses
- Open
- In Progress
- Resolved
- Closed

### User Roles
- User
- Technician
- Admin

### Monitoring Statuses
- OK
- WARNING
- ERROR

## Automated Features

1. **Auto-Escalation**: Critical tickets automatically receive escalation comments
2. **Auto-Status Change**: Assigning a ticket automatically changes status to "In Progress"
3. **Auto-Alerts**: ERROR status in monitoring automatically generates alerts
4. **Audit Trails**: All user actions are automatically logged
5. **Auto-Reports**: All modules support automated report generation
6. **Auto-Timestamps**: All records automatically track creation and update times

## Demo
Run the comprehensive demo to see all features:
```bash
./demo.sh
```

## Data Storage
All data is stored in JSON files in the `data/` directory:
- `data/assets.json` - Asset inventory
- `data/tickets.json` - Ticket records
- `data/users.json` - User accounts
- `data/monitoring.json` - System health checks

## Configuration
Edit `config.yaml` to customize:
- Data file locations
- Valid categories and statuses
- Monitoring intervals
