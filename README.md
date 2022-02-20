# ACIT3495_Project1

This project is to build a containerized microservice data colectiona dn analytics system. 

## System Component
- Node Express: front end app to enter a subject's name and grade, and authentication passport js
- Python Flask: backend to calculate a user's Highest, lowest and average mark.
- Mysql: Collect all subjects' names and grades
- MongoDB: Collect users' highest, lowest and average mark.

## To build the system with docker
1. Go to docker directory
2. Run command: docker-compose up -d 
3. Once all services are running, access to localhost:8001 on browser

## To use the system
1. Enter Subject name and grade. Press submit button
2. User register and GitHub Auth is not yet implement yet. 
    For testing purpose, enter test@gmail.com for email and test123! for password.
3. Wait for around 5 seconds, it will redirect to a page that show the analytics.
4. Press Enter new grade button to submit another grade.
