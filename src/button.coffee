###
 * Cylon button driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require './cylon-gpio'

namespace = require 'node-namespace'

namespace "Cylon.Drivers.GPIO", ->
  class @Button extends Cylon.Driver
    constructor: (opts) ->
      super
      @pin = @device.pin
      @isPressed = false

    commands: ->
      ['isPressed']

    start: (callback) ->
      Logger.debug "Button on pin #{@pin} started"
      @connection.digitalRead @pin, (data) =>
        if data is 1
          @isPressed = true
          @device.emit 'push'
        else
          @isPressed = false
          @device.emit 'release'

      super

    stop: ->
      Logger.debug "Button on pin #{@pin} stopping"
      super