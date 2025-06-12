from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str

class EmployeeBase(BaseModel):
    first_name: str
    middle_name: str
    last_name: Optional[str]
    phone_number: str
    login: str
    role_id: int

class EmployeeCreate(EmployeeBase):
    password: str

class EmployeeOut(EmployeeBase):
    employee_id: int

class VisitorBase(BaseModel):
    first_name: str
    middle_name: str
    last_name: Optional[str]
    phone_number: str
    date_birth: datetime
    date_registration: datetime

class VisitorCreate(VisitorBase):
    pass

class VisitorOut(VisitorBase):
    visitor_id: int

class EventBase(BaseModel):
    name: str
    date_start: datetime
    date_end: datetime
    description: str
    age_limit: int

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    event_id: int

class ThreatLevelBase(BaseModel):
    threat_level: int
    description: str

class ThreatLevelCreate(ThreatLevelBase):
    pass

class ThreatLevelOut(ThreatLevelBase):
    threatlevel_id: int

class IncidentBase(BaseModel):
    date_incident: datetime
    threatlevel_id: int
    event_id: int
    status: str
    date_elimination: datetime

class IncidentCreate(IncidentBase):
    pass

class IncidentOut(IncidentBase):
    incident_id: int

class ActionBase(BaseModel):
    threatlevel_id: int
    protocol: str

class ActionCreate(ActionBase):
    pass

class ActionOut(ActionBase):
    action_id: int

class AssociationEmployee(BaseModel):
    event_id: int
    employee_id: int

class AssociationVisitor(BaseModel):
    event_id: int
    visitor_id: int

class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class RoleOut(RoleBase):
    role_id: int

    class Config:
        orm_mode = True
