UIBalances.controller('HeaderCtrl',function($scope, $http, $uibModal, $ngConfirm) {
    /**
     * Show list Accounts
     */
    $scope.showAccountsList = function () {
        $uibModal.open({
            templateUrl: 'views/modals/accounts.html',
            controller: 'ModalAccounts',
            scope: $scope
        }).result.catch(function () {});
    };

    /**
     * Add new Account modal
     */
    $scope.addAccount = function () {
        $ngConfirm({
            title: 'Добавление Аккаунта',
            contentUrl: 'views/modals/add-account.html',
            type: 'green',
            closeIcon: true,
            buttons: {
                add: {
                    text: 'Добавить',
                    disabled: true,
                    btnClass: 'btn-green',
                    action: function (scope) {
                        $http.post('/account', {
                            login: scope.login,
                            token: scope.token
                        }).then(function () {
                            $ngConfirm('Аккаунт <b>' + scope.login + '</b>, успешно добавлен, выполняется запрос...');
                        }).catch(function (res) {
                            $ngConfirm('Ошибка добавления '+res.status);
                        });
                    }
                },
            },
            onScopeReady: function (scope) {
                var self = this;
                scope.textChange = function () {
                    console.log(scope.form.$valid);
                    if (scope.form.$valid)
                        self.buttons.add.setDisabled(false);
                    else
                        self.buttons.add.setDisabled(true);
                }
            }
        });
    }
});