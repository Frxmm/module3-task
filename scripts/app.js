var app = angular.module('MenuApp', []);

app.directive('foundItems', function() {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      onRemove: '&',
      onAddToCart: '&'
    },
    template: `
      <div class="grid-container">
        <div class="grid-item" ng-repeat="item in items">
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p><strong>Short Name:</strong> {{ item.short_name }}</p>
            <p><strong>Description:</strong> {{ item.description }}</p>
          </div>
          <button class="remove-button" ng-click="onRemove({index: $index})">Don't want this one!</button>
          <button class="add-to-cart-button" ng-click="onAddToCart({item: item})">Add to Cart</button>
          <hr ng-if="$index % 2 === 0" class="dashed-line">
          <hr ng-if="$index % 2 !== 0" class="solid-line">
        </div>
      </div>
    `
  };
});
app.directive('cartItems', function() {
    return {
      restrict: 'E',
      scope: {
        items: '='
      },
      template: `
        <div class="cart-container">
          <h2>Cart</h2>
          <ul>
            <li ng-repeat="item in items">
              <strong>{{ item.name }}</strong> ({{ item.short_name }}) - {{ item.description }}
            </li>
          </ul>
        </div>
      `
    };
  });

app.controller('MenuController', ['$http', function($http) {
  var vm = this;
  vm.searchTerm = "";
  vm.foundItems = [];
  vm.message = "";

  // Fetch and filter menu 
  vm.narrowItDown = function() {
    if (!vm.searchTerm.trim()) {
      vm.foundItems = [];
      vm.message = "Nothing found";
      return;
    }

    $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
      .then(function(response) {
        var menuData = response.data;
        vm.foundItems = [];
        vm.cartItems = [];

        // Process menu items
        Object.values(menuData).forEach(function(category) {
          category.menu_items.forEach(function(item) {
            if (item.description.toLowerCase().includes(vm.searchTerm.toLowerCase())) {
              vm.foundItems.push({
                name: item.name,
                short_name: item.short_name,
                description: item.description
              });
            }
          });
        });

        vm.message = vm.foundItems.length > 0 ? "" : "Nothing found";
      })
      .catch(function(error) {
        console.error('Error fetching menu items:', error);
        vm.message = "Error retrieving menu items. Please try again later.";
      });
  };

  // Remove item from the list
  vm.removeItem = function(index) {
    console.log(index);
    vm.foundItems.splice(index, 1);
    if (vm.foundItems.length === 0) {
      vm.message = "Nothing found";
    }
  };
  vm.addToCart = function(item) {
    console.log(item);
    vm.cartItems.push(item);
  };
}]);