'use strict';

describe('Controller: SecondaryCtrl', function () {

  // load the controller's module
  beforeEach(module('angularClientApp'));

  var SecondaryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SecondaryCtrl = $controller('SecondaryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
