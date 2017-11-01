UIBalances.controller('DashboardCtrl',function($scope) {
    var socket = io();
    socket.on('Data', function (data) {
        console.log(data);
        $scope.action_accounts = data;
        $scope.$apply();
    })
});