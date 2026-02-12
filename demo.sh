#!/bin/bash
# Demonstration of IT Management Automation System
# This script demonstrates all automation features

echo "=========================================="
echo "IT Management Automation System Demo"
echo "=========================================="
echo ""

# Clean existing data for demo
rm -f data/*.json

echo "1. ASSET MANAGEMENT - Automated Inventory Tracking"
echo "---------------------------------------------------"
echo "Adding IT assets to inventory..."
python itmanager.py asset add --name "Dell PowerEdge R740" --category "Server" --location "Data Center A1" --serial "SN123456"
python itmanager.py asset add --name "HP EliteBook 850" --category "Laptop" --location "Office 301"
python itmanager.py asset add --name "Cisco Catalyst 2960" --category "Network Device" --location "Network Room"
echo ""
echo "Listing all assets:"
python itmanager.py asset list
echo ""
echo "Asset Report (Automated Summary):"
python itmanager.py asset report
echo ""
echo ""

echo "2. TICKET MANAGEMENT - Automated Workflows"
echo "-------------------------------------------"
echo "Creating tickets with different priorities..."
python itmanager.py ticket create --title "Critical: Database Server Down" --description "Production database is not responding" --priority "Critical" --requester "Maria Silva"
TICKET1=$(python itmanager.py ticket list 2>/dev/null | grep "Critical: Database" | awk '{print $2}')
python itmanager.py ticket create --title "New user account request" --description "Create account for new employee" --priority "Low" --requester "João Santos"
TICKET2=$(python itmanager.py ticket list 2>/dev/null | tail -1 | awk '{print $2}')
echo ""
echo "Listing open tickets:"
python itmanager.py ticket list --status "Open"
echo ""
echo "AUTOMATED WORKFLOW: Assigning critical ticket (auto-changes status to 'In Progress')..."
# Get first ticket ID
FIRST_TICKET=$(cat data/tickets.json | python -c "import sys, json; tickets = json.load(sys.stdin); print(tickets[0]['id'])" 2>/dev/null)
if [ ! -z "$FIRST_TICKET" ]; then
    python itmanager.py ticket assign --ticket-id "$FIRST_TICKET" --assign "Senior Technician"
    echo ""
    echo "Updated ticket list (note status change):"
    python itmanager.py ticket list
fi
echo ""
echo "Ticket Report:"
python itmanager.py ticket report
echo ""
echo ""

echo "3. USER MANAGEMENT - Automated Access Control"
echo "----------------------------------------------"
echo "Creating user accounts with automated audit trail..."
python itmanager.py user create --username "admin" --fullname "System Administrator" --email "admin@company.com" --role "Admin" --department "IT"
python itmanager.py user create --username "tech1" --fullname "Carlos Oliveira" --email "tech1@company.com" --role "Technician" --department "IT Support"
python itmanager.py user create --username "user1" --fullname "Ana Costa" --email "user1@company.com" --role "User" --department "Finance"
echo ""
echo "Listing all users:"
python itmanager.py user list
echo ""
echo "User Report:"
python itmanager.py user report
echo ""
echo ""

echo "4. SYSTEM MONITORING - Automated Health Checks & Alerts"
echo "--------------------------------------------------------"
echo "Recording system health checks..."
python itmanager.py monitor check --system "Web Server" --check-type "HTTP" --status "OK" --message "Response time: 45ms"
python itmanager.py monitor check --system "Application Server" --check-type "CPU" --status "WARNING" --message "CPU usage at 85%"
python itmanager.py monitor check --system "Database Server" --check-type "Connection" --status "ERROR" --message "Connection pool exhausted"
python itmanager.py monitor check --system "Email Server" --check-type "SMTP" --status "OK" --message "Service responding"
echo ""
echo "System Status (Real-time Dashboard):"
python itmanager.py monitor status
echo ""
echo "AUTOMATED ALERTS (automatically generated for ERROR status):"
python itmanager.py monitor alerts
echo ""
echo "Monitoring Report:"
python itmanager.py monitor report
echo ""
echo ""

echo "=========================================="
echo "Demo Complete!"
echo "=========================================="
echo ""
echo "Key Automation Features Demonstrated:"
echo "✓ Automated asset tracking and inventory management"
echo "✓ Ticket workflow automation (auto-status changes, auto-escalation)"
echo "✓ User provisioning with automatic audit trails"
echo "✓ Automated health monitoring with alert generation"
echo "✓ Automated report generation across all modules"
echo ""
echo "All data is stored in JSON files in the data/ directory"
echo "Run individual commands using: python itmanager.py <module> <action> [options]"
echo ""
