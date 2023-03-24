// 在這裡添加你的程式
//% weight=0 color=#3CB371 icon="\uf2db" block="GigoBlockly" groups='["Motor", "超音波", "顏色感測", "Receive"]'
enum PingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches
}
enum MotorChannel {
    //% block="A"
    MotorA = 1,
    //% block="B"
    MotorB = 2,
    //% block="C"
    MotorC = 3,
    //% block="D"
    MotorD = 4
}
namespace GigoBlockly {
    /**馬達通道定義註解
   A(0,14)
   B(1,2)
   C(8,13)
   D(15,16)
   */


    //% blockId=DDMmotor2 block="Motor Channel %MotorPin|speed of MSpeed(0~255) %MSpeedValue|direction of Mcontrol(0~1) %McontrolValue" blockExternalInputs=false
    //% McontrolValue.min=0 McontrolValue.max=1 
    //% MSpeedValue.min=0 MSpeedValue.max=255   
    //% group="Motor"
    export function DDMmotor2(MotorPin: MotorChannel, MSpeedValue: number, McontrolValue: number): void {

        switch (MotorPin) {
            case 1:
                pins.analogWritePin(AnalogPin.P0, pins.map(MSpeedValue, 0, 255, 0, 1023));
                pins.digitalWritePin(DigitalPin.P14, pins.map(McontrolValue, 0, 1, 0, 1));
                break;
            case 2:
                pins.analogWritePin(AnalogPin.P1, pins.map(MSpeedValue, 0, 255, 0, 1023));
                pins.digitalWritePin(DigitalPin.P2, pins.map(McontrolValue, 0, 1, 0, 1));
            case 3:
                pins.analogWritePin(AnalogPin.P8, pins.map(MSpeedValue, 0, 255, 0, 1023));
                pins.digitalWritePin(DigitalPin.P13, pins.map(McontrolValue, 0, 1, 0, 1));
                break;
            case 4:
                pins.analogWritePin(AnalogPin.P15, pins.map(MSpeedValue, 0, 255, 0, 1023));
                pins.digitalWritePin(DigitalPin.P16, pins.map(McontrolValue, 0, 1, 0, 1));
                break;

        }
    }
    /**超音波註解
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig tigger pin
     * @param echo echo pin
     * @param unit desired conversion unit
     * @param maxCmDistance maximum distance in centimeters (default is 500)
     */



    //% blockId=sonar_ping block="ping trig %trig|echo %echo|unit %unit"
    //% group="超音波"
    export function ping(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case PingUnit.Centimeters: return Math.idiv(d, 58);
            case PingUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }
    /**馬達註解
    */
    //% blockId=DDMmotor block="MSpeed pin %MSpeedPin|speed of MSpeed(0~255) %MSpeedValue|Mcontrol pin %McontrolPin|direction of Mcontrol(0~1) %McontrolValue" blockExternalInputs=false
    //% McontrolValue.min=0 McontrolValue.max=1 
    //% MSpeedValue.min=0 MSpeedValue.max=255   
    //% MSpeedPin.fieldEditor="gridpicker" MSpeedPin.fieldOptions.columns=4
    //% MSpeedPin.fieldOptions.tooltips="false" MSpeedPin.fieldOptions.width="300"
    //% McontrolPin.fieldEditor="gridpicker" McontrolPin.fieldOptions.columns=4
    //% McontrolPin.fieldOptions.tooltips="false" McontrolPin.fieldOptions.width="300"
    //% group="Motor"
    export function DDMmotor(McontrolPin: DigitalPin,McontrolValue: number,MSpeedPin: AnalogPin,MSpeedValue: number): void {
        pins.digitalWritePin(McontrolPin, pins.map(McontrolValue, 0, 1, 0, 1));
        pins.analogWritePin(MSpeedPin, pins.map(MSpeedValue, 0, 255, 0, 1023));	   
    }
    //% weight=12
    //% block="Color Sensor init"
    //% group="顏色感測"
    export function ColorSensorinit(): void {
        pins.i2cWriteNumber(41, 33276, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 32771, NumberFormat.UInt16BE, false)
    }
    /**
    */
    let nowReadColor = [0, 0, 0]
    //% weight=12
    //% block="Color Sensor read color"
    //% group="顏色感測"
    export function ColorSensorReadColor(): void {
        pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true)
        let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true)
        let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true)
        let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255))
        TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255))
        TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255))
        nowReadColor = [TCS_RED, TCS_GREEN, TCS_BLUE]
    }
    /**
   */
    export enum Channel {
        //% block="R"
        Red = 1,
        //% block="G"
        Green = 2,
        //% block="B"
        Blue = 3
    }
    //% weight=12
    //% block="Color Sensor read RGB %channel |channel"
    //% group="顏色感測"
    export function ColorSensorRead(channel: Channel = 1): number {
        pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true)
        let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true)
        let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true)
        let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)

        let RdCl = 0
        switch (channel) {
            case 1:
                RdCl = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255))
                break;
            case 2:
                RdCl = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255))
                break;
            case 3:
                RdCl = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255))
                break;
        }

        return RdCl
    }

}
