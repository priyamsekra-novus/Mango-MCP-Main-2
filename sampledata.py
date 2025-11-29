"""
Sample Data Script for MongoDB - Employee Performance Data

This script generates and inserts dummy employee performance data including:
- Employee information
- Attendance records
- Payroll data
- Performance KPIs
- Department metrics
"""

import pymongo
from datetime import datetime, timedelta
import random
from faker import Faker

# Initialize Faker for generating realistic dummy data
fake = Faker()

# MongoDB connection string
MONGO_URI = ""
DATABASE_NAME = "employee_performance_db"

# Connect to MongoDB
client = pymongo.MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
employees_collection = db["employees"]
attendance_collection = db["attendance"]
payroll_collection = db["payroll"]
performance_kpis_collection = db["performance_kpis"]
departments_collection = db["departments"]


def clear_existing_data():
    """Clear existing data from all collections"""
    print("Clearing existing data...")
    employees_collection.delete_many({})
    attendance_collection.delete_many({})
    payroll_collection.delete_many({})
    performance_kpis_collection.delete_many({})
    departments_collection.delete_many({})
    print("✓ Existing data cleared")


def generate_departments():
    """Generate department data"""
    print("\nGenerating departments...")
    
    departments = [
        {
            "department_id": "DEPT001",
            "name": "Engineering",
            "head": "John Smith",
            "budget": 500000,
            "employee_count": 25,
            "location": "Building A"
        },
        {
            "department_id": "DEPT002",
            "name": "Sales",
            "head": "Sarah Johnson",
            "budget": 350000,
            "employee_count": 20,
            "location": "Building B"
        },
        {
            "department_id": "DEPT003",
            "name": "Marketing",
            "head": "Michael Brown",
            "budget": 250000,
            "employee_count": 15,
            "location": "Building B"
        },
        {
            "department_id": "DEPT004",
            "name": "Human Resources",
            "head": "Emily Davis",
            "budget": 200000,
            "employee_count": 10,
            "location": "Building A"
        },
        {
            "department_id": "DEPT005",
            "name": "Finance",
            "head": "David Wilson",
            "budget": 300000,
            "employee_count": 12,
            "location": "Building C"
        }
    ]
    
    result = departments_collection.insert_many(departments)
    print(f"✓ Inserted {len(result.inserted_ids)} departments")
    return departments


def generate_employees(num_employees=100):
    """Generate employee data"""
    print(f"\nGenerating {num_employees} employees...")
    
    departments = ["DEPT001", "DEPT002", "DEPT003", "DEPT004", "DEPT005"]
    positions = [
        "Software Engineer", "Senior Engineer", "Team Lead", "Manager",
        "Sales Representative", "Sales Manager", "Marketing Specialist",
        "HR Specialist", "Accountant", "Financial Analyst", "Product Manager"
    ]
    
    employees = []
    for i in range(num_employees):
        # Convert date to datetime for MongoDB compatibility
        hire_date = fake.date_between(start_date="-5y", end_date="today")
        hire_datetime = datetime.combine(hire_date, datetime.min.time())
        
        employee = {
            "employee_id": f"EMP{str(i+1).zfill(4)}",
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "email": fake.email(),
            "phone": fake.phone_number(),
            "department_id": random.choice(departments),
            "position": random.choice(positions),
            "hire_date": hire_datetime,
            "salary": random.randint(40000, 150000),
            "status": random.choice(["Active", "Active", "Active", "Active", "On Leave"]),
            "address": {
                "street": fake.street_address(),
                "city": fake.city(),
                "state": fake.state(),
                "zip_code": fake.zipcode()
            },
            "emergency_contact": {
                "name": fake.name(),
                "relationship": random.choice(["Spouse", "Parent", "Sibling"]),
                "phone": fake.phone_number()
            }
        }
        employees.append(employee)
    
    result = employees_collection.insert_many(employees)
    print(f"✓ Inserted {len(result.inserted_ids)} employees")
    return employees


def generate_attendance_records(employees, num_months=6):
    """Generate attendance records for the last N months"""
    print(f"\nGenerating attendance records for last {num_months} months...")
    
    attendance_records = []
    today = datetime.now()
    
    for employee in employees:
        # Generate records for each working day in the last N months
        for month_offset in range(num_months):
            current_date = today - timedelta(days=30 * month_offset)
            days_in_month = 22  # Average working days
            
            for day in range(days_in_month):
                record_date = current_date - timedelta(days=day)
                
                # Skip weekends
                if record_date.weekday() >= 5:
                    continue
                
                # Random attendance status
                status_weights = [0.85, 0.05, 0.03, 0.02, 0.05]  # Present, Absent, Late, Half-day, Leave
                status = random.choices(
                    ["Present", "Absent", "Late", "Half-day", "Leave"],
                    weights=status_weights
                )[0]
                
                # Generate check-in and check-out times
                if status == "Present":
                    check_in = record_date.replace(hour=random.randint(8, 9), minute=random.randint(0, 59))
                    check_out = record_date.replace(hour=random.randint(17, 19), minute=random.randint(0, 59))
                    hours_worked = 8 + random.uniform(-1, 1)
                elif status == "Late":
                    check_in = record_date.replace(hour=random.randint(10, 11), minute=random.randint(0, 59))
                    check_out = record_date.replace(hour=random.randint(17, 19), minute=random.randint(0, 59))
                    hours_worked = 7 + random.uniform(-1, 1)
                elif status == "Half-day":
                    check_in = record_date.replace(hour=random.randint(8, 9), minute=random.randint(0, 59))
                    check_out = record_date.replace(hour=random.randint(12, 14), minute=random.randint(0, 59))
                    hours_worked = 4
                else:
                    check_in = None
                    check_out = None
                    hours_worked = 0
                
                record = {
                    "employee_id": employee["employee_id"],
                    "date": record_date,
                    "status": status,
                    "check_in": check_in,
                    "check_out": check_out,
                    "hours_worked": round(hours_worked, 2),
                    "notes": fake.sentence() if status in ["Absent", "Leave"] else None
                }
                attendance_records.append(record)
    
    result = attendance_collection.insert_many(attendance_records)
    print(f"✓ Inserted {len(result.inserted_ids)} attendance records")


def generate_payroll_records(employees, num_months=6):
    """Generate payroll records"""
    print(f"\nGenerating payroll records for last {num_months} months...")
    
    payroll_records = []
    today = datetime.now()
    
    for employee in employees:
        monthly_salary = employee["salary"] / 12
        
        for month_offset in range(num_months):
            pay_date = today - timedelta(days=30 * month_offset)
            pay_period_start = pay_date.replace(day=1)
            pay_period_end = pay_date.replace(day=28)
            
            # Calculate deductions and bonuses
            tax = monthly_salary * 0.15
            insurance = random.uniform(200, 500)
            retirement = monthly_salary * 0.05
            bonus = random.uniform(0, 1000) if random.random() > 0.7 else 0
            overtime_pay = random.uniform(0, 500) if random.random() > 0.6 else 0
            
            gross_pay = monthly_salary + bonus + overtime_pay
            total_deductions = tax + insurance + retirement
            net_pay = gross_pay - total_deductions
            
            record = {
                "employee_id": employee["employee_id"],
                "pay_period_start": pay_period_start,
                "pay_period_end": pay_period_end,
                "pay_date": pay_date,
                "base_salary": round(monthly_salary, 2),
                "overtime_pay": round(overtime_pay, 2),
                "bonus": round(bonus, 2),
                "gross_pay": round(gross_pay, 2),
                "deductions": {
                    "tax": round(tax, 2),
                    "insurance": round(insurance, 2),
                    "retirement": round(retirement, 2),
                    "total": round(total_deductions, 2)
                },
                "net_pay": round(net_pay, 2),
                "payment_method": random.choice(["Direct Deposit", "Check"]),
                "status": "Paid"
            }
            payroll_records.append(record)
    
    result = payroll_collection.insert_many(payroll_records)
    print(f"✓ Inserted {len(result.inserted_ids)} payroll records")


def generate_performance_kpis(employees):
    """Generate performance KPI data"""
    print("\nGenerating performance KPIs...")
    
    kpi_records = []
    today = datetime.now()
    
    for employee in employees:
        # Generate quarterly KPIs
        for quarter in range(4):
            review_date = today - timedelta(days=90 * quarter)
            
            record = {
                "employee_id": employee["employee_id"],
                "review_date": review_date,
                "quarter": f"Q{4 - quarter}",
                "year": review_date.year,
                "metrics": {
                    "productivity_score": round(random.uniform(60, 100), 2),
                    "quality_score": round(random.uniform(65, 100), 2),
                    "attendance_score": round(random.uniform(70, 100), 2),
                    "teamwork_score": round(random.uniform(60, 100), 2),
                    "communication_score": round(random.uniform(65, 100), 2),
                    "innovation_score": round(random.uniform(50, 100), 2)
                },
                "goals_achieved": random.randint(3, 10),
                "goals_total": 10,
                "projects_completed": random.randint(2, 8),
                "customer_satisfaction": round(random.uniform(3.5, 5.0), 1),
                "peer_rating": round(random.uniform(3.0, 5.0), 1),
                "manager_rating": round(random.uniform(3.0, 5.0), 1),
                "overall_rating": round(random.uniform(3.0, 5.0), 1),
                "strengths": [
                    random.choice([
                        "Strong technical skills",
                        "Excellent communication",
                        "Great team player",
                        "Problem-solving ability",
                        "Leadership qualities"
                    ]) for _ in range(2)
                ],
                "areas_for_improvement": [
                    random.choice([
                        "Time management",
                        "Documentation",
                        "Meeting deadlines",
                        "Attention to detail",
                        "Proactive communication"
                    ]) for _ in range(2)
                ],
                "comments": fake.paragraph(),
                "reviewer": fake.name()
            }
            
            # Calculate overall score
            metrics = record["metrics"]
            overall_score = sum(metrics.values()) / len(metrics)
            record["overall_score"] = round(overall_score, 2)
            
            kpi_records.append(record)
    
    result = performance_kpis_collection.insert_many(kpi_records)
    print(f"✓ Inserted {len(result.inserted_ids)} performance KPI records")


def create_indexes():
    """Create indexes for better query performance"""
    print("\nCreating indexes...")
    
    # Employee indexes
    employees_collection.create_index("employee_id", unique=True)
    employees_collection.create_index("department_id")
    employees_collection.create_index("email", unique=True)
    
    # Attendance indexes
    attendance_collection.create_index([("employee_id", 1), ("date", -1)])
    attendance_collection.create_index("date")
    
    # Payroll indexes
    payroll_collection.create_index([("employee_id", 1), ("pay_date", -1)])
    payroll_collection.create_index("pay_date")
    
    # Performance KPI indexes
    performance_kpis_collection.create_index([("employee_id", 1), ("review_date", -1)])
    performance_kpis_collection.create_index([("year", 1), ("quarter", 1)])
    
    # Department indexes
    departments_collection.create_index("department_id", unique=True)
    
    print("✓ Indexes created")


def print_summary():
    """Print summary of inserted data"""
    print("\n" + "="*60)
    print("DATA INSERTION SUMMARY")
    print("="*60)
    print(f"Database: {DATABASE_NAME}")
    print(f"Departments: {departments_collection.count_documents({})}")
    print(f"Employees: {employees_collection.count_documents({})}")
    print(f"Attendance Records: {attendance_collection.count_documents({})}")
    print(f"Payroll Records: {payroll_collection.count_documents({})}")
    print(f"Performance KPIs: {performance_kpis_collection.count_documents({})}")
    print("="*60)
    
    # Sample queries
    print("\nSample Statistics:")
    print(f"- Active Employees: {employees_collection.count_documents({'status': 'Active'})}")
    print(f"- Average Salary: ${employees_collection.aggregate([{'$group': {'_id': None, 'avg': {'$avg': '$salary'}}}]).next()['avg']:,.2f}")
    
    # Attendance stats
    total_present = attendance_collection.count_documents({"status": "Present"})
    total_absent = attendance_collection.count_documents({"status": "Absent"})
    total_records = attendance_collection.count_documents({})
    if total_records > 0:
        print(f"- Attendance Rate: {(total_present / total_records * 100):.2f}%")
        print(f"- Absence Rate: {(total_absent / total_records * 100):.2f}%")
    
    print("\n✓ Data insertion completed successfully!")


def main():
    """Main function to generate all sample data"""
    print("="*60)
    print("EMPLOYEE PERFORMANCE DATA GENERATOR")
    print("="*60)
    
    try:
        # Clear existing data
        clear_existing_data()
        
        # Generate data
        generate_departments()
        employees = generate_employees(num_employees=100)
        generate_attendance_records(employees, num_months=6)
        generate_payroll_records(employees, num_months=6)
        generate_performance_kpis(employees)
        
        # Create indexes
        create_indexes()
        
        # Print summary
        print_summary()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise
    finally:
        client.close()
        print("\n✓ Database connection closed")


if __name__ == "__main__":
    main()