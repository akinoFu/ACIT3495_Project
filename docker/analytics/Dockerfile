FROM ubuntu

# Install required applications
RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y libmysqlclient-dev

# Copy the application folder 
COPY analytics-app /analytics-app

# Replace the configuration file
COPY docker/analytics/app_conf.yml /analytics-app/app_conf.yml

# Install dependencies
WORKDIR /analytics-app
RUN pip install -r requirements.txt



