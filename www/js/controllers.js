angular.module('starter.controllers', [])

  .controller('LoginCtrl', function ($scope, $ionicLoading, $state, $ionicPopup, $rootScope, WalletUseCases) {
    $rootScope.obtenerBalance = function () {
      WalletUseCases.getBalance().then(
        function success(response) {
          console.log("configuracion de firebase Controller", response);
          $rootScope.saldoActualPuntos = response.balance;
        }, function error(error) {
          console.log("erro: ", error);
        }
      );
    };

    $scope.doLogin = function (dni, password) {
      $rootScope.dni = dni;
      if (dni !== null) {
        $rootScope.obtenerBalance();
        $state.go('products');
      } else {
        $ionicLoading.hide();
        console.log("sin acceso");
      }
    };
  })
  .controller('ProductsCtrl', function ($scope, $state, Products, $ionicPopup, $ionicHistory) {
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    $scope.products = Products.allProducts();
    $scope.buy = function () {
      //Pasar el monto de la compra
      $scope.monto = 0;
      $scope.listProducts = [];
      $scope.products.forEach(function (product) {
        console.log("valor check: ", product.checked, product.price);
        if (product.checked)
          $scope.listProducts.push(product);
      }, this);

      if ($scope.listProducts.length > 0) {
        console.log("PRODUCTOS SELECCIONADOS:  ", $scope.listProducts);
        $state.go('pay', { 'products': angular.toJson($scope.listProducts) });
      } else {
        alert("No se ha seleccionado ningun producto", $ionicPopup);
      }
    };
  })

  .controller('PayCtrl', function ($scope, $state, $stateParams, Products, $ionicPopup, $ionicLoading, $ionicHistory, $rootScope, WalletUseCases) {
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    console.log("PAREMTORS: ", angular.fromJson($stateParams.products));
    //$rootScope.dataBalance = requestGetBalance($rootScope.dni, $rootScope.configFirebase); //se envia el DNI
    $rootScope.obtenerBalance();

    $scope.listProducts = angular.fromJson($stateParams.products);
    $scope.monto = 0;
    $scope.total = $scope.monto;
    $scope.inter;
    $scope.equivalente = 0;
    $scope.calcularMonto = function (listProducts) {
      $scope.monto = 0;
      $scope.total = 0;
      angular.forEach(listProducts, function (value, key) {
        $scope.monto += value.price * value.qty;
        $scope.total = $scope.monto - $scope.equivalente;
      });
    };
    $scope.calcularMonto($scope.listProducts);

    $scope.add = function (item) {
      item.qty++;
      $scope.calcularMonto($scope.listProducts);
    };

    $scope.rem = function (item) {
      if (item.qty > 1) {
        item.qty--;
        $scope.calcularMonto($scope.listProducts);
      }
    };

    $scope.calcularEquivalente = function () {
      console.log("punts: ", $scope.inter);
      if ($scope.inter > 0 && $scope.inter <= $rootScope.saldoActualPuntos) {
        $scope.equivalente = $scope.inter * 1;
        $scope.total = $scope.monto - $scope.equivalente;
      } else {
        $scope.equivalente = 0;
        $scope.inter = 0;
        $scope.total = $scope.monto - $scope.equivalente;
      }
    };

    $scope.back = function () {
      $state.go('products');
    };

    $scope.payVisa = function () {
      if ($scope.inter === $scope.monto) {
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner><p>Procesando..</p>'
        });
        $scope.dataBuy = requestBuy($rootScope.dni, $scope.monto + '', $scope.inter + '');
        WalletUseCases.buy($scope.dataBuy).then(
          function success(response) {
            console.log("respuesta: ", response);
            $ionicLoading.hide();
            alert('Pago realizado correctamente.', $ionicPopup);
            Products.clean();
            $state.go('products');
          }, function error(error) {
            console.log("error de peticion", error);
            $ionicLoading.hide();
            alert('Problemas con el Servidor.', $ionicPopup);
          });
      } else {
        $state.go('visa', { 'ic': $scope.inter, 'soles': $scope.monto });
      }
    };

    $scope.confirmPay = function (response) {
      var myPopupPay = $ionicPopup.show({
        title: 'Realizar Pago',
        templateUrl: 'templates/popup/pay-popup.html',
        scope: $scope
      });
      $scope.pay = function () {
        myPopupPay.close(); //close the popup after 3 seconds for some reason
        $ionicHistory.clearCache().then(function () {
          $scope.payVisa();
        });
      };
      $scope.closePopup = function () {
        myPopupPay.close();
      };
    };

  })
  .controller('VisaCtrl', function ($scope, $ionicPopup, $timeout, $ionicHistory, $ionicLoading, $state, Products, WalletUseCases, $rootScope, $stateParams) {
    console.log("PARAMS: ", $stateParams.ic, $stateParams.soles);
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    $scope.procesar = function () {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner><p>Procesando..</p>'
      });
      //invocar metodo buy
      $scope.dataBuy = requestBuy($rootScope.dni, $scope.monto + '', $scope.inter + '');
      console.log("DATA BUY VISA: ", $scope.dataBuy);
      WalletUseCases.buy($scope.dataBuy).then(
        function success(response) {
          console.log("respuesta: ", response);
          $ionicLoading.hide();
          alert('Pago realizado correctamente.', $ionicPopup);
          Products.clean();
          $state.go('products');
        }, function error(error) {
          console.log("error", error);
          $ionicLoading.hide();
          alert('Problemas con el Servidor.', $ionicPopup);
        });
    };

    $scope.confirmPay = function (response) {
      var myPopupPay = $ionicPopup.show({
        title: 'Realizar Pago',
        templateUrl: 'templates/popup/pay-popup.html',
        scope: $scope
      });
      $scope.pay = function () {
        myPopupPay.close(); //close the popup after 3 seconds for some reason
        $ionicHistory.clearCache().then(function () {
          $scope.procesar();
        });
      };
      $scope.closePopup = function () {
        myPopupPay.close();
      };
    };

    $rootScope.openSuccess = function (response) {
      var myPopupOk = $ionicPopup.show({
        title: 'Transaccion Satisfactoria',
        templateUrl: 'templates/success.html',
        //template: '<div class="text-center"><i style="font-size:xx-large; color: #0D47A1;" class="ion-checkmark-round"></i></div>',
        scope: $scope
      });

      $scope.graciasOk = function () {
        myPopupOk.close(); //close the popup after 3 seconds for some reason
        $ionicHistory.clearCache().then(function () {
          Products.clean();
          $state.go('products');
        });
      };

    };
  });
