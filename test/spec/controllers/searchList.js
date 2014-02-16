'use strict';

describe('Controller: SearchlistCtrl', function () {

  // load the controller's module
  beforeEach(module('angularClientApp'));

  var SearchlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchlistCtrl = $controller('SearchlistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
