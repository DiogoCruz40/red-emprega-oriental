#Restore from a backup
To see the list of backups, you can run:

docker exec backup /listbackups.sh
To restore database from a certain backup, simply run (pass in just the timestamp part of the filename):

docker exec backup /restore.sh 20170406T155812
To restore latest just:

docker exec backup /restore.sh