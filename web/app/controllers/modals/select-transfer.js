UIBalances.controller('modalSelectTransfer',function($scope, $uibModalInstance, $uibModal, $timeout) {
    $scope.accounts = [];
    $scope.button_disabled = false;

    if(!$scope.action_accounts.length)
        $timeout(AllAccountsSelect,5000);
    else AllAccountsSelect();

    function AllAccountsSelect() {
        /* global angular */
        angular.forEach($scope.action_accounts, function (value) {
            value.select = true;
            value.curr_balance = value.balance;
            this.push(value);
        }, $scope.accounts);
    }

    /**
     * Change Checkbox
     */
    $scope.changeCheckbox = function () {
        var check = $scope.accounts.find(function (value) {
            if(value.select) return value;
            return false;
        });

        $scope.button_disabled = !!check;
    };

    /**
     * Go to transfer modal
     */
    $scope.transfer = function () {
        if(!$scope.accounts.length || !$scope.wallet) return;

        $uibModal.open({
            templateUrl: 'views/modals/transfer-to-qiwi-wallet.html',
            controller: 'modalTransferToQiwiWallet',
            scope: $scope,
            backdrop: 'static'
        }).result.then(function () {
                $scope.close();
            }).catch(function () {
                $scope.close();
            });
    };

    /**
     * CLOSE THIS MODAL
     * */
    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
});