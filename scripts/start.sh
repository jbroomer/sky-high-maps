echo "starting backend"
docker container stop $(docker ps -a -q)
echo "docker stopped"
pkill python
echo "python killed"
docker run -p 5000:5000 -v /root/mldFiles/car:/data osrm/osrm-backend osrm-routed --algorithm mld /data/massachusetts-latest.osrm &
echo "docker car profile started on port 5000"
docker run -p 5001:5000 -v /root/mldFiles/min-elevation:/data osrm/osrm-backend osrm-routed --algorithm mld /data/massachusetts-latest.osrm &
echo "docker min-elevation profile started on port 5001"
docker run -p 5002:5000 -v /root/mldFiles/max-elevation:/data osrm/osrm-backend osrm-routed --algorithm mld /data/massachusetts-latest.osrm &
echo "docker max-elevation profile started on port 5002"
nohup python pagekite.py 5000 skyhighmaps.pagekite.me AND 5001 osrm-skyhighmaps.pagekite.me AND 5002 elevation-skyhighmaps.pagekite.me &
echo "pagekite started"