FROM mongo:4.4

RUN apt-get update && apt-get -y install cron awscli

ENV CRON_TIME="0 3 * * *" \
  TZ=Europe/Lisbon \
  CRON_TZ=Europe/Lisbon

ADD run.sh /run.sh

USER root 
RUN chmod 755 /run.sh

CMD /run.sh