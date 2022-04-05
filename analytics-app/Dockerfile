FROM ubuntu

RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y libmysqlclient-dev

COPY . /analytics-app
WORKDIR /analytics-app
RUN pip install -r requirements.txt

EXPOSE 8080

#command to run within the container
CMD [ "python3", "app.py" ]