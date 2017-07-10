angular.module('starter.repositories', [])
    .service("WalletRepository", ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
        this.getPromise = function (url, data) {
            var defer = $q.defer();
            $http.post(url, data, { timeout: 3000, headers: { 'Content-Type': 'application/json; charset=UTF-8' } })
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (data, status, headers, config) {
                    defer.reject(data, status, headers, config);
                });
            return defer.promise;
        };

        this.getBalance = function () {
            var urlFirebase = "https://venta-e7fad.firebaseio.com/app.json";
            var defer = $q.defer();
            $http.get(urlFirebase, { timeout: 40000 })
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (data, status, headers, config) {
                    defer.reject(data, status, headers, config);
                });
            return defer.promise;
        };

        this.doBuy = function (requestBuy) {
            //Este metodo no envia los datos y valida en firebase, solo hace una peticion comun.
            //Lo utilice para poder somular que la compra se realiza correctamente. y continuar con el flujo de la app
            console.log("DATOS DE ENVIO PARA COMPRA: ", requestBuy);
            var urlFirebase = "https://venta-e7fad.firebaseio.com/app.json";
            var defer = $q.defer();
            $http.get(urlFirebase, { timeout: 40000 })
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (data, status, headers, config) {
                    defer.reject(data, status, headers, config);
                });
            return defer.promise;
        };

    }]);