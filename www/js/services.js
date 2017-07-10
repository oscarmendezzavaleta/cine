angular.module('starter.services', [])
  .factory('Products', function () {
    var products = [{
      id: 0,
      name: 'Saga Crepúsculo',
      price: 15,
      image: '1.jpg',
      qty: 1,
      checked: false
    },{
      id: 1,
      name: 'Combo 2',
      price: 14,
      image: '2.jpg',
      qty: 1,
      checked: false
    },{
      id: 2,
      name: 'Combo 3',
      price: 25,
      image: '3.jpg',
      qty: 1,
      checked: false
    },{
      id: 3,
      name: '1 Pop corn + 2 Bebidas',
      price: 20,
      image: '4.jpg',
      qty: 1,
      checked: false
    },{
      id: 4,
      name: 'Combo 5',
      price: 12,
      image: '5.jpg',
      qty: 1,
      checked: false
    }];

    return {
      allProducts: function () {
        return products;
      },
      clean: function(){
        products.forEach(function(item){
          item.checked = false;
        }, this)
      }
    };
  });
