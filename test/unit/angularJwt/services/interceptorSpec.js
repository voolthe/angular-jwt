'use strict';

describe('interceptor', function() {

  beforeEach(function() {
    module('angular-jwt.interceptor');
  });


  it('should intercept requests when added to $httpProvider.interceptors and set token', function (done) {
    module( function ($httpProvider, jwtInterceptorProvider) {
      jwtInterceptorProvider.tokenGetter = function() {
        return 123;
      }
      $httpProvider.interceptors.push('jwtInterceptor');
    });

    inject(function ($http, $httpBackend) {
        $http({url: '/hello'}).success(function (data) {
          expect(data).to.be.equal('hello');
          done();
        });

        $httpBackend.expectGET('/hello', function (headers) {
          return headers.Authorization === 'Bearer 123';
        }).respond(200, 'hello');
        $httpBackend.flush();
    });

  });

  it('should work with promises', function (done) {
    module( function ($httpProvider, jwtInterceptorProvider) {
      jwtInterceptorProvider.tokenGetter = function($q) {
        return $q.when(345);
      }
      $httpProvider.interceptors.push('jwtInterceptor');
    });

    inject(function ($http, $httpBackend) {
        $http({url: '/hello'}).success(function (data) {
          expect(data).to.be.equal('hello');
          done();
        });

        $httpBackend.expectGET('/hello', function (headers) {
          return headers.Authorization === 'Bearer 345';
        }).respond(200, 'hello');
        $httpBackend.flush();
    });

  });

  it('should not send it if no tokenGetter', function (done) {
    module( function ($httpProvider, jwtInterceptorProvider) {
      $httpProvider.interceptors.push('jwtInterceptor');
    });

    inject(function ($http, $httpBackend) {
        $http({url: '/hello'}).success(function (data) {
          expect(data).to.be.equal('hello');
          done();
        });

        $httpBackend.expectGET('/hello', function (headers) {
          return !headers.Authorization;
        }).respond(200, 'hello');
        $httpBackend.flush();
    });

  });
});
