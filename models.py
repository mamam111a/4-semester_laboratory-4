from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Role(Base):
    __tablename__ = "roles"
    role_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))

class Employee(Base):
    __tablename__ = "employee"
    employee_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(30))
    middle_name = Column(String(30))
    last_name = Column(String(30))
    phone_number = Column(String(30))
    login = Column(String(30), unique=True)
    password = Column(String(128))
    role_id = Column(Integer, ForeignKey("roles.role_id"))
    role = relationship("Role")

class Visitor(Base):
    __tablename__ = "visitor"
    visitor_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(30))
    middle_name = Column(String(30))
    last_name = Column(String(30))
    phone_number = Column(String(30))
    date_birth = Column(DateTime)
    date_registration = Column(DateTime)

class Event(Base):
    __tablename__ = "event"
    event_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30))
    date_start = Column(DateTime)
    date_end = Column(DateTime)
    description = Column(String(200))
    age_limit = Column(Integer)

class ThreatLevel(Base):
    __tablename__ = "threatlevel"
    threatlevel_id = Column(Integer, primary_key=True, index=True)
    threat_level = Column(Integer)
    description = Column(String(200))

class Incident(Base):
    __tablename__ = "incident"
    incident_id = Column(Integer, primary_key=True, index=True)
    date_incident = Column(DateTime)
    threatlevel_id = Column(Integer, ForeignKey("threatlevel.threatlevel_id"))
    event_id = Column(Integer, ForeignKey("event.event_id"))
    status = Column(String(20))
    date_elimination = Column(DateTime)

class Action(Base):
    __tablename__ = "action"
    action_id = Column(Integer, primary_key=True, index=True)
    threatlevel_id = Column(Integer, ForeignKey("threatlevel.threatlevel_id"))
    protocol = Column(String(200))

class AssociationEmployees(Base):
    __tablename__ = "association_employees"
    event_id = Column(Integer, ForeignKey("event.event_id"), primary_key=True)
    employee_id = Column(Integer, ForeignKey("employee.employee_id"), primary_key=True)

class AssociationVisitors(Base):
    __tablename__ = "association_visitors"
    event_id = Column(Integer, ForeignKey("event.event_id"), primary_key=True)
    visitor_id = Column(Integer, ForeignKey("visitor.visitor_id"), primary_key=True)
