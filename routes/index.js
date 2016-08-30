var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var connectionString = 'postgres://localhost:5432/bulbthings';

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.post('/api/v1/assets', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {name: req.body.name,
                type: req.body.type.value,
                quantity: req.body.quantity,
                seatcapacity: req.body.seatcapacity,
                touchscreen: req.body.touchscreen,
                sheetcapacity: req.body.sheetcapacity,
                cameras: req.body.cameras,
                speakers: req.body.speakers};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO assets(name, type, quantity, seatcapacity, touchscreen, sheetcapacity, cameras, speakers) values($1, $2, $3, $4, $5, $6, $7, $8)",
                      [data.name,
                       data.type,
                       data.quantity,
                       data.seatcapacity,
                       data.touchscreen,
                       data.sheetcapacity,
                       data.cameras,
                       data.speakers ]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM assets ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

router.get('/api/v1/assets', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM assets ORDER BY name ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});

router.put('/api/v1/assets/:asset_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.asset_id;

    // Grab data from http request
    var data = {name: req.body.name,
                type: req.body.type,
                quantity: req.body.quantity,
                seatcapacity: req.body.seatcapacity,
                touchscreen: req.body.touchscreen,
                sheetcapacity: req.body.sheetcapacity,
                cameras: req.body.cameras,
                speakers: req.body.speakers};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE assets SET name=($1), type=($2), quantity=($3), seatcapacity=($4), touchscreen=($5), sheetcapacity=($6), cameras=($7), speakers=($8) WHERE id=($9)",
        [data.name,
         data.type,
         data.quantity,
         data.seatcapacity,
         data.touchscreen,
         data.sheetcapacity,
         data.cameras,
         data.speakers,
         id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM assets ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

router.delete('/api/v1/assets/:asset_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.asset_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM assets WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM assets ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

module.exports = router;
