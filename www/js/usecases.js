angular.module('starter.usecases', [])
    .service("WalletUseCases", ['$q', 'WalletRepository', function ($q, WalletRepository) {
        this.getPromise = function (objPromise, objFunction) {
            var defer = $q.defer();
            objPromise.then(function success(response) {
                defer.resolve(objFunction(response));
            }, function reject(data, status, headers, config) {
                defer.reject(false);
            });
            return defer.promise;
        };

        this.getBalance = function () {
            return this.getPromise(WalletRepository.getBalance(),
                function (response) {
                    return response;
                });
        };

        this.buy = function (requestBuy) {
            return this.getPromise(WalletRepository.doBuy(requestBuy),
                function (response) {
                    return response;
                });
        };

    }]);