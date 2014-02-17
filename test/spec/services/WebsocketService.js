'use strict';

describe('Service: Websocketservice', function () {

  // load the service's module
  beforeEach(module('AngularClientApp'));

  // instantiate service
  var Websocketservice;
  beforeEach(inject(function (_Websocketservice_) {
    Websocketservice = _Websocketservice_;
  }));

  it('should do something', function () {
    expect(!!Websocketservice).toBe(true);
  });

});
