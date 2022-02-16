FROM ubuntu

RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y libmysqlclient-dev

COPY analytics-app /analytics-app
COPY docker/analytics/app_conf.yml /analytics-app/app_conf.yml
WORKDIR /analytics-app
RUN pip install -r requirements.txt



