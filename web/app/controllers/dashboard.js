UIBalances.controller('DashboardCtrl',function($rootScope, socket) {
    /* Listen data balances */
    socket.on('Data', function (data) {
        $rootScope.action_accounts = data;
        $rootScope.$apply();
    })
});