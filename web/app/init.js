/**
 * Init global settings and run the app
 * */
UIBalances.run(function($rootScope, $ngConfirmDefaults){
    // Patterns
    $rootScope.patterns = {
        login: '\\d{10}'
    };

    // Alerts Default Options
    $ngConfirmDefaults.theme = 'modern';
});