angular.module('bulbThings', [])
.filter('lowercaseNoSpace', function() {
  // Go through provided text, remove spaces and change to lowercase
  return function (text) {
      var str = text.replace(/\s+/g, '');
      return str.toLowerCase();
    };
})
.controller('mainController', function($scope, $http) {
    // Initialize variables
    $scope.formData = {};
    $scope.allAssets = [];
    $scope.assets = [];
    $scope.filterType = null;
    var deleteTarget = null;

    // Key defaults
    $scope.keys = [ "Name", "Type", "Quantity", "Seat Capacity",
                   "Sheet Capacity", "Cameras", "Speakers" ];

    // Types reference
    $scope.options = [ { "label" : "Car", "value" : 1 },
                       { "label" : "Printer", "value" : 2},
                       { "label" : "Phone", "value" : 3} ];

    // Field keys based on type
    $scope.fields = [ [ 3 ], [ 4 ], [ 5, 6] ];

    // Filter based on type or return all assets
    $scope.filterAssets = function () {
      if ($scope.filterType != null)
        $scope.assets = $scope.allAssets.filter(function (el) {
          return el.type == $scope.filterType.value;
        });
      else
        $scope.assets = $scope.allAssets;
    }

    // Update assets and filter
    $scope.updateAssets = function (newAssets) {
      $scope.allAssets = newAssets;
      $scope.filterAssets();
    }

    // Store type and reset form data
    $scope.resetForm = function () {
      var type = $scope.formData.type;
      $scope.assetForm.$setPristine();
      $scope.formData = { "type" : type };
    }

    // Set asset to be edited
    $scope.edit = function (asset) {
      $scope.formData = asset;
    }

    // Set asset to be deleted
    $scope.delete = function (assetID) {
      deleteTarget = assetID;
    }

    // Get all assets and update list
    $http.get('/api/v1/assets')
        .success(function(data) {
            $scope.updateAssets(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    // Delete target asset and update assets list
    $scope.deleteAsset = function() {
        $http.delete('/api/v1/assets/' + deleteTarget)
            .success(function(data) {
                $scope.updateAssets(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Create provided asset, reset form data and update assets list
    $scope.createAsset = function(isValid) {
      if (isValid) {
        $http.post('/api/v1/assets', $scope.formData)
            .success(function(data) {
                $scope.resetForm();
                $scope.updateAssets(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
      }
    };

    // Edit target asset, reset edit form and update assets list
    $scope.editAsset = function (isValid, assetID) {
      if (isValid) {
        $http.put('/api/v1/assets/' + assetID, $scope.formData)
            .success(function(data) {
                $scope.resetForm();
                $scope.updateAssets(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
      }
    }
});
