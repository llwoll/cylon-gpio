/**
 * Created by zysd on 15/12/28.
 */
/*
 * Stepper driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
 */

"use strict";

var Cylon = require("cylon");

/**
 * A stepper driver
 *
 * @constructor stepper
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 * @param {Number} opts.freq Stepper frequency
 * @param {Object} [opts.pwmScale] pwm scale
 * @param {Number} opts.pwmScale.bottom pwm scale bottom
 * @param {Number} opts.pwmScale.top pwm scale top
 */
var Stepper = module.exports = function Stepper(opts) {
    Stepper.__super__.constructor.apply(this, arguments);

    this.freq = opts.freq || null;

    //stepper 的四个引脚
    this.motor_pin_1 = opts.pin1 || null;
    this.motor_pin_2 = opts.pin2 || null;
    this.motor_pin_3 = opts.pin3 || null;
    this.motor_pin_4 = opts.pin4 || null;
    // pin_count is used by the stepMotor() method:
    this.pin_count = 4;
    this.step_number = 0;      // which step the motor is on
    this.speed = 0;        // the motor speed, in revolutions per minute
    this.direction = 0;      // motor direction
    this.last_step_time = 0;    // time stamp in ms of the last step taken
    this.number_of_steps = opts.number_of_steps || null;    // total number of steps for this motor

    if(this.number_of_steps == null){
        this.number_of_steps = 200;
    }

    //this.speedValue = 0;
    //this.isOn = false;
    //this.pwmScale = opts.pwmScale || { bottom: 0, top: 255 };

    if (this.motor_pin_1 == null) {
        throw new Error("No pin specified for Stepper. Cannot proceed");
    }
    if (this.motor_pin_2 == null) {
        throw new Error("No pin specified for Stepper. Cannot proceed");
    }
    if (this.motor_pin_3 == null) {
        throw new Error("No pin specified for Stepper. Cannot proceed");
    }
    if (this.motor_pin_4 == null) {


        throw new Error("No pin specified for Stepper. Cannot proceed");
    }

    this.commands = {
        setSpeed: this.setSpeed,
        current_speed: this.currentSpeed,
        stepMotor:this.stepMotor,
        step:this.step,
        millis:this.millis,
        on:this.on
    };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(Stepper, Cylon.Driver);

/**
 * Starts the Stepper
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Stepper.prototype.start = function(callback) {
    callback();
};

/**
 * Stops the Stepper
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Stepper.prototype.halt = function(callback) {
    callback();
};

/**
 * Sets the Stepper's speed to the PWM value provided (0-255)
 *
 * @param {whatSpeed} value PWM value to set the speed to (0-255)
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Stepper.prototype.setSpeed = function(whatSpeed, callback) {

    this.step_delay = 60 * 1000 / this.number_of_steps / whatSpeed;




    //var scaledDuty = (value).fromScale(this.pwmScale.bottom, this.pwmScale.top);
    //
    //this.connection.pwmWrite(
    //    this.pin,
    //    scaledDuty,
    //    this. freq,
    //    null, null,
    //    callback
    //);
    //
    //this.speedValue = value;
    //this.isOn = this.speedValue > 0;
};

Stepper.prototype.on = function () {
    //while(true){
    //    this.setSpeed(110);
    //    this.step(2);
    //}
}


Stepper.prototype.step = function(steps_to_move,callback){


    console.log("come in step ");

    var steps_left = Math.abs(steps_to_move);  // how many steps to take

    // determine direction based on whether steps_to_mode is + or -:
    if (steps_to_move > 0) {this.direction = 1;}
    if (steps_to_move < 0) {this.direction = 0;}


    // decrement the number of steps, moving one step each time:
    while(steps_left > 0) {

        //console.log("countinue in step          "  + this.millis() + "^^^^^^^^^^^^^^^" + this.last_step_time +"@@@@@@@@@"+ this.step_delay);


        // move only if the appropriate delay has passed:
        if (this.millis() - this.last_step_time >= this.step_delay) {

            //console.log("now time is &&&&&&&&&&"+this.step_delay);


            // get the timeStamp of when you stepped:
            this.last_step_time = this.millis();
            // increment or decrement the step number,
            // depending on direction:
            if (this.direction == 1) {
                this.step_number++;
                if (this.step_number == this.number_of_steps) {
                    this.step_number = 0;
                }
            }
            else {
                if (this.step_number == 0) {
                    this.step_number = this.number_of_steps;
                }
                this.step_number--;
            }
            // decrement the steps left:
            steps_left--;
            // step the motor to step number 0, 1, 2, or 3:
            this.stepMotor(this.step_number % 4);
            console.log("steppe into   " + steps_left +"delay "+ this.step_delay+"last_delay"+this.last_step_time);
        }
    }

}

Stepper.prototype.millis = function(){
    return new Date().getTime();
}

Stepper.prototype.stepMotor = function(this_step){


    if (this.pin_count == 2) {
        switch (this_step) {
            case 0: /* 01 */
                this.connection.digitalWrite(this.motor_pin_1, 0);
                this.connection.digitalWrite(this.motor_pin_1, 1);
                break;
            case 1: /* 11 */
                this.connection.digitalWrite(this.motor_pin_1,1);
                this.connection.digitalWrite(this.motor_pin_1, 1);
                break;
            case 2: /* 10 */
                this.connection.digitalWrite(this.motor_pin_1, 1);
                this.connection.digitalWrite(this.motor_pin_2, 0);
                break;
            case 3: /* 00 */
                this.connection.digitalWrite(this.motor_pin_1, 0);
                this.connection.digitalWrite(this.motor_pin_2, 0);
                break;
        }
    }
    if (this.pin_count == 4) {
        console.log("come in step motor-------------"  + this_step);
        switch (this_step) {
            case 0:    // 1010
                //this.connection.digitalWrite(this.motor_pin_1, 1, callback);
                this.connection.digitalWrite(this.motor_pin_1, 1);
                this.connection.digitalWrite(this.motor_pin_2, 0);
                this.connection.digitalWrite(this.motor_pin_3, 1);
                this.connection.digitalWrite(this.motor_pin_4, 0);
                break;
            case 1:    // 0110
                this.connection.digitalWrite(this.motor_pin_1, 0);
                this.connection.digitalWrite(this.motor_pin_2, 1);
                this.connection.digitalWrite(this.motor_pin_3, 1);
                this.connection.digitalWrite(this.motor_pin_4, 0);
                break;
            case 2:    //0101
                this.connection.digitalWrite(this.motor_pin_1, 0);
                this.connection.digitalWrite(this.motor_pin_2, 1);
                this.connection.digitalWrite(this.motor_pin_3, 0);
                this.connection.digitalWrite(this.motor_pin_4, 1);
                break;
            case 3:    //1001
                this.connection.digitalWrite(this.motor_pin_1, 1);
                this.connection.digitalWrite(this.motor_pin_2, 0);
                this.connection.digitalWrite(this.motor_pin_3, 0);
                this.connection.digitalWrite(this.motor_pin_4, 1);
                break;
        }
    }

}





/**
 * Turns the Stepper on by writing a HIGH (1) value to the pin
 *
 * Also sets `this.isOn` to `true`.
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Stepper.prototype.turnOn = function(callback) {
    this.isOn = true;
    this.connection.digitalWrite(this.pin, 1, callback);
};

/**
 * Turns the Stepper off by writing a LOW (0) value to the pin
 *
 * Also sets `this.isOn` to `false`.
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Stepper.prototype.turnOff = function(callback) {
    this.isOn = false;
    this.connection.digitalWrite(this.pin, 0, callback);
};

/**
 * Toggles the Stepper on or off, depending on its current state
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {void}
 * @publish
 */
Stepper.prototype.toggle = function(callback) {
    if (this.isOn) {
        this.turnOff();
    } else {
        this.turnOn();
    }

    if (typeof callback === "function") {
        callback();
    }
};

/**
 * Returns the Stepper's current speed value
 *
 * @param {Function} [callback] - (err, val)
 * @return {step_delay} the current Stepper speed
 * @publish
 */
Stepper.prototype.currentSpeed = function(callback) {
    if (typeof callback === "function") {
        callback(null, this.step_delay);
    }

    return this.step_delay;
};

