var pg = require('pg');
var connectionString = 'postgres://localhost:5432/bulbthings';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE assets(id SERIAL PRIMARY KEY, name VARCHAR(80) not null, quantity integer not null,type integer not null, seatcapacity integer, touchscreen integer, sheetcapacity integer, cameras integer, speakers integer)');
query.on('end', function() { client.end(); });
