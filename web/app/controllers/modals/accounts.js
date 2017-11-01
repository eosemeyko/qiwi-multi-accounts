UIBalances.controller('ModalAccounts',function($scope, $http, $uibModalInstance) {
    $scope.accounts = [];
    $scope.show_alert = false;

    $http.get('/accounts')
        .then(function (res) {
            $scope.accounts = res.data
        })
        .catch(function (res) {
            if(res.status === 400) $scope.show_alert = "Сохраненные данные нарушены!";
            if(res.status === 404) $scope.show_alert = "Данные не найдены";
            if(res.status !== 400 && res.status !== 404) $scope.show_alert = "Ошибка "+res.status;
    });

    /**
     * CLOSE THIS MODAL
     * */
    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
});