UIBalances.controller('modalTransferToQiwiWallet',function($scope, $uibModalInstance, $http, $ngConfirm, socket) {
    $scope.transferLog = [];
    $scope.close_disable = true;

    /* Listen transfer Log */
    socket.on('transferLog', function (data) {
        $scope.transferLog.push(data);
        $scope.$apply();
    });

    /**
     * Request transfer
     */
    $http.post('/transfer-to-qiwi-wallet', {
        accounts: $scope.accounts,
        wallet: $scope.wallet
    })
        .then(function (res) {
            if(!res.data) {
                $ngConfirm('Что-то пошло не так!', 'Ошибка');
                return $scope.close();
            }

            $scope.close_disable = false;
        });

    /**
     * CLOSE THIS MODAL
     * */
    $scope.close = function() {
        socket.removeListeners('transferLog');
        $uibModalInstance.dismiss('cancel');
    };
});