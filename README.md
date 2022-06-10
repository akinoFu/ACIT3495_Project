
# Grade Recording App
## 1. About
- A school project associated with the Computer Information Technology Diploma program at British Columbia Institute of Technology (BC, Canada)
- Built as microservices architecture consisting of 6 services
- Each service is run as a **Docker** container
- Tested with **Kubernetes** using GKE
![Alt text](https://i.ibb.co/MfBqrPz/Untitled.png)

## 2. Services
### Frontend
- Authentication
	- Created with **Node.js** + **Express** + **Passport**
	- Source dir: *auth*
	- Docker Image: cherylk19/auth:latest
- Data Entry
	- Created with **Node.js** + **Express**
	- Source dir: *front*
	- Docker image: cherylk19/front:latest
- Show Records
	- Created with **Node.js** + **Express**
	- Source dir: *data*
	- Docker image: cherylk19/data:latest
### Backend
- Analytics Service
	- Created with **Python** + **Flask**
	- Source dir: *analytics-app*
	- Docker image: akinofu/analytics-app:latest
- MySQL
	- Docker image: mysql:5.7
- MongoDB
	- Docker image: mongo:latest

## How to Run

I. If you want to run it as a Docker application
1. Clone the repo to local
2. Go to the *docker* folder
3. Run the following command:
	```
	docker-compose -d
	```
II. If you want to run it on GKE
1. Create a cluster on GKE
2. Clone the repo on the cluster
3. Apply all the yaml files in the *k8* folder
