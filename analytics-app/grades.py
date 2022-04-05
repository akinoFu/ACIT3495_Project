from sqlalchemy import Column, Float, Integer, String, DateTime
from base import Base

class GradeItem(Base):
    """ Grades """

    __tablename__ = "grades"

    name = Column(String(250), primary_key=True)
    subject = Column(String(250), nullable=False)
    grade = Column(Integer, nullable=False)
 

    def __init__(self, name, subject, grade):
        """ Initializes an income reading """
        self.name = name
        self.subject = subject
        self.grade = grade


    def to_dict(self):
        """ Dictionary Representation of an income reading """
        dict = {}
        dict['name'] = self.name
        dict['subject'] = self.subject
        dict['grade'] = self.grade

        return dict
