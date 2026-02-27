#!/usr/bin/env python3
"""
IT Management System - Command Line Interface
Provides automated management of IT assets, tickets, users, and monitoring
"""
import sys
import argparse
from tabulate import tabulate
from src.asset_manager import AssetManager
from src.ticket_manager import TicketManager
from src.user_manager import UserManager
from src.monitoring import SystemMonitor


def print_table(data, headers):
    """Print data in a formatted table"""
    if not data:
        print("No data found.")
        return
    print(tabulate(data, headers=headers, tablefmt="grid"))


def asset_commands(args):
    """Handle asset management commands"""
    manager = AssetManager()
    
    if args.asset_action == "add":
        asset = manager.add_asset(
            name=args.name,
            category=args.category,
            description=args.description or "",
            serial_number=args.serial or "",
            location=args.location or ""
        )
        print(f"✓ Asset created: {asset['id']}")
        print_table([asset.values()], asset.keys())
    
    elif args.asset_action == "list":
        assets = manager.list_assets(category=args.category, status=args.status)
        if assets:
            print(f"Found {len(assets)} asset(s):")
            table_data = [[a['id'], a['name'], a['category'], a['status'], a['location']] 
                         for a in assets]
            print_table(table_data, ['ID', 'Name', 'Category', 'Status', 'Location'])
        else:
            print("No assets found.")
    
    elif args.asset_action == "report":
        report = manager.generate_report()
        print("\n=== ASSET REPORT ===")
        print(f"Total Assets: {report['total_assets']}")
        print(f"\nBy Category:")
        for cat, count in report['by_category'].items():
            print(f"  {cat}: {count}")
        print(f"\nBy Status:")
        for status, count in report['by_status'].items():
            print(f"  {status}: {count}")
        print(f"\nGenerated: {report['generated_at']}")


def ticket_commands(args):
    """Handle ticket management commands"""
    manager = TicketManager()
    
    if args.ticket_action == "create":
        ticket = manager.create_ticket(
            title=args.title,
            description=args.description,
            priority=args.priority,
            requester=args.requester or "",
            assigned_to=args.assign or ""
        )
        print(f"✓ Ticket created: {ticket['id']}")
        print_table([ticket.values()], ticket.keys())
    
    elif args.ticket_action == "list":
        tickets = manager.list_tickets(
            status=args.status,
            priority=args.priority,
            assigned_to=args.assign
        )
        if tickets:
            print(f"Found {len(tickets)} ticket(s):")
            table_data = [[t['id'], t['title'], t['priority'], t['status'], t['assigned_to']] 
                         for t in tickets]
            print_table(table_data, ['ID', 'Title', 'Priority', 'Status', 'Assigned To'])
        else:
            print("No tickets found.")
    
    elif args.ticket_action == "update":
        ticket = manager.update_ticket_status(args.ticket_id, args.new_status)
        if ticket:
            print(f"✓ Ticket {args.ticket_id} updated to status: {args.new_status}")
        else:
            print(f"✗ Ticket {args.ticket_id} not found.")
    
    elif args.ticket_action == "assign":
        ticket = manager.assign_ticket(args.ticket_id, args.assign)
        if ticket:
            print(f"✓ Ticket {args.ticket_id} assigned to: {args.assign}")
        else:
            print(f"✗ Ticket {args.ticket_id} not found.")
    
    elif args.ticket_action == "report":
        report = manager.generate_report()
        print("\n=== TICKET REPORT ===")
        print(f"Total Tickets: {report['total_tickets']}")
        print(f"Open Tickets: {report['open_tickets']}")
        print(f"\nBy Status:")
        for status, count in report['by_status'].items():
            print(f"  {status}: {count}")
        print(f"\nBy Priority:")
        for priority, count in report['by_priority'].items():
            print(f"  {priority}: {count}")
        print(f"\nGenerated: {report['generated_at']}")


def user_commands(args):
    """Handle user management commands"""
    manager = UserManager()
    
    if args.user_action == "create":
        user = manager.create_user(
            username=args.username,
            full_name=args.fullname,
            email=args.email,
            role=args.role,
            department=args.department or ""
        )
        print(f"✓ User created: {user['id']}")
        print_table([user.values()], user.keys())
    
    elif args.user_action == "list":
        users = manager.list_users(role=args.role, status=args.status)
        if users:
            print(f"Found {len(users)} user(s):")
            table_data = [[u['id'], u['username'], u['full_name'], u['role'], u['status']] 
                         for u in users]
            print_table(table_data, ['ID', 'Username', 'Full Name', 'Role', 'Status'])
        else:
            print("No users found.")
    
    elif args.user_action == "deactivate":
        user = manager.deactivate_user(args.user_id)
        if user:
            print(f"✓ User {args.user_id} deactivated.")
        else:
            print(f"✗ User {args.user_id} not found.")
    
    elif args.user_action == "report":
        report = manager.generate_report()
        print("\n=== USER REPORT ===")
        print(f"Total Users: {report['total_users']}")
        print(f"Active Users: {report['active_users']}")
        print(f"\nBy Role:")
        for role, count in report['by_role'].items():
            print(f"  {role}: {count}")
        print(f"\nBy Status:")
        for status, count in report['by_status'].items():
            print(f"  {status}: {count}")
        print(f"\nGenerated: {report['generated_at']}")


def monitor_commands(args):
    """Handle monitoring commands"""
    monitor = SystemMonitor()
    
    if args.monitor_action == "check":
        check = monitor.record_check(
            system_name=args.system,
            check_type=args.check_type,
            status=args.status,
            message=args.message or ""
        )
        print(f"✓ Check recorded: {check['id']}")
        if check['alert_sent']:
            print(f"⚠ ALERT: {check['alert_message']}")
    
    elif args.monitor_action == "status":
        if args.system:
            status = monitor.get_system_status(args.system)
            print(f"\n=== STATUS: {status['system_name']} ===")
            print(f"Status: {status['status']}")
            print(f"Message: {status['message']}")
            print(f"Last Check: {status['last_check']}")
        else:
            statuses = monitor.get_all_systems_status()
            if statuses:
                print(f"Found {len(statuses)} monitored system(s):")
                table_data = [[s['system_name'], s['status'], s['last_check']] 
                             for s in statuses]
                print_table(table_data, ['System', 'Status', 'Last Check'])
            else:
                print("No monitored systems found.")
    
    elif args.monitor_action == "alerts":
        alerts = monitor.get_alerts(limit=args.limit)
        if alerts:
            print(f"Found {len(alerts)} alert(s):")
            table_data = [[a['system_name'], a['status'], a['message'], a['timestamp']] 
                         for a in alerts]
            print_table(table_data, ['System', 'Status', 'Message', 'Timestamp'])
        else:
            print("No alerts found.")
    
    elif args.monitor_action == "report":
        report = monitor.generate_report()
        print("\n=== MONITORING REPORT ===")
        print(f"Total Checks: {report['total_checks']}")
        print(f"Monitored Systems: {report['monitored_systems']}")
        print(f"Total Alerts: {report['total_alerts']}")
        print(f"\nBy Status:")
        for status, count in report['by_status'].items():
            print(f"  {status}: {count}")
        print(f"\nGenerated: {report['generated_at']}")


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description='IT Management Automation System - Automate manual IT processes'
    )
    subparsers = parser.add_subparsers(dest='module', help='Module to use')
    
    # Asset Management
    asset_parser = subparsers.add_parser('asset', help='Asset management')
    asset_subparsers = asset_parser.add_subparsers(dest='asset_action')
    
    asset_add = asset_subparsers.add_parser('add', help='Add new asset')
    asset_add.add_argument('--name', required=True, help='Asset name')
    asset_add.add_argument('--category', required=True, help='Asset category')
    asset_add.add_argument('--description', help='Asset description')
    asset_add.add_argument('--serial', help='Serial number')
    asset_add.add_argument('--location', help='Asset location')
    
    asset_list = asset_subparsers.add_parser('list', help='List assets')
    asset_list.add_argument('--category', help='Filter by category')
    asset_list.add_argument('--status', help='Filter by status')
    
    asset_subparsers.add_parser('report', help='Generate asset report')
    
    # Ticket Management
    ticket_parser = subparsers.add_parser('ticket', help='Ticket management')
    ticket_subparsers = ticket_parser.add_subparsers(dest='ticket_action')
    
    ticket_create = ticket_subparsers.add_parser('create', help='Create new ticket')
    ticket_create.add_argument('--title', required=True, help='Ticket title')
    ticket_create.add_argument('--description', required=True, help='Ticket description')
    ticket_create.add_argument('--priority', default='Medium', help='Ticket priority')
    ticket_create.add_argument('--requester', help='Requester name')
    ticket_create.add_argument('--assign', help='Assign to technician')
    
    ticket_list = ticket_subparsers.add_parser('list', help='List tickets')
    ticket_list.add_argument('--status', help='Filter by status')
    ticket_list.add_argument('--priority', help='Filter by priority')
    ticket_list.add_argument('--assign', help='Filter by assigned technician')
    
    ticket_update = ticket_subparsers.add_parser('update', help='Update ticket status')
    ticket_update.add_argument('--ticket-id', required=True, help='Ticket ID')
    ticket_update.add_argument('--new-status', required=True, help='New status')
    
    ticket_assign = ticket_subparsers.add_parser('assign', help='Assign ticket')
    ticket_assign.add_argument('--ticket-id', required=True, help='Ticket ID')
    ticket_assign.add_argument('--assign', required=True, help='Assign to technician')
    
    ticket_subparsers.add_parser('report', help='Generate ticket report')
    
    # User Management
    user_parser = subparsers.add_parser('user', help='User management')
    user_subparsers = user_parser.add_subparsers(dest='user_action')
    
    user_create = user_subparsers.add_parser('create', help='Create new user')
    user_create.add_argument('--username', required=True, help='Username')
    user_create.add_argument('--fullname', required=True, help='Full name')
    user_create.add_argument('--email', required=True, help='Email address')
    user_create.add_argument('--role', default='User', help='User role')
    user_create.add_argument('--department', help='Department')
    
    user_list = user_subparsers.add_parser('list', help='List users')
    user_list.add_argument('--role', help='Filter by role')
    user_list.add_argument('--status', help='Filter by status')
    
    user_deactivate = user_subparsers.add_parser('deactivate', help='Deactivate user')
    user_deactivate.add_argument('--user-id', required=True, help='User ID')
    
    user_subparsers.add_parser('report', help='Generate user report')
    
    # Monitoring
    monitor_parser = subparsers.add_parser('monitor', help='System monitoring')
    monitor_subparsers = monitor_parser.add_subparsers(dest='monitor_action')
    
    monitor_check = monitor_subparsers.add_parser('check', help='Record system check')
    monitor_check.add_argument('--system', required=True, help='System name')
    monitor_check.add_argument('--check-type', required=True, help='Check type')
    monitor_check.add_argument('--status', required=True, choices=['OK', 'WARNING', 'ERROR'], help='Check status')
    monitor_check.add_argument('--message', help='Status message')
    
    monitor_status = monitor_subparsers.add_parser('status', help='Get system status')
    monitor_status.add_argument('--system', help='System name (all if not specified)')
    
    monitor_alerts = monitor_subparsers.add_parser('alerts', help='Get recent alerts')
    monitor_alerts.add_argument('--limit', type=int, default=20, help='Number of alerts to show')
    
    monitor_subparsers.add_parser('report', help='Generate monitoring report')
    
    args = parser.parse_args()
    
    if not args.module:
        parser.print_help()
        return
    
    try:
        if args.module == 'asset':
            asset_commands(args)
        elif args.module == 'ticket':
            ticket_commands(args)
        elif args.module == 'user':
            user_commands(args)
        elif args.module == 'monitor':
            monitor_commands(args)
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
