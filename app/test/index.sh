DB_PATH=/Users/nomand/Documents/db-mocha/

mkdir $DB_PATH

mkdir $DB_PATH/log

touch $DB_PATH/log/log.log

mkdir $DB_PATH/data

mongod -f ./mongodb.conf

export NODE_ENV='unitTest'

pm2 ../server.js

sleep 5s

mocha ./index.js
