UIBalances.controller('DashboardCtrl',function($scope, socket) {
    /* Listen data balances */
    socket.on('Data', function (data) {
        $scope.action_accounts = data;
        $scope.$apply();
    })
});