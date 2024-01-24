// 在這裡添加你的程式
//% weight=0 color=#3CB371 icon="\uf2db" block="gigotools" groups='["Motor", "Ultrasound", "RGB LED", "Color Sensor"]'
enum PingUnit {
    //% block="cm"
    Centimeters, 
    //% block="μs"
    MicroSeconds,
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
enum RGBLedColors {
    //% block=off
    Off = 0x000000,
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF
   
}
namespace Gigotools {

    ////////////////////////////////
    //          DDM Motor         //
    ////////////////////////////////


   /**馬達通道定義註解
   A(1,2)
   B(8,13)
   C(14,15)
   D(16,0)
   I2C(20,19)
   */
    //% blockId=DDMmotor2 block="motor channel %MotorPin|speed (0~100) %MSpeedValue|rotation direction(0~1) %McontrolValue" blockExternalInputs=false
    //% McontrolValue.min=0 McontrolValue.max=1 
    //% MSpeedValue.min=0 MSpeedValue.max=100   
    //% group="Motor"
    export function DDMmotor2(MotorPin: MotorChannel, MSpeedValue: number, McontrolValue: number): void {

        switch (MotorPin) {
            case 1:
                pins.analogWritePin(AnalogPin.P1, pins.map(MSpeedValue, 0, 100, 0, 1000));
                pins.digitalWritePin(DigitalPin.P2, pins.map(McontrolValue, 0, 1, 0, 1));
                break;
            case 2:
                pins.analogWritePin(AnalogPin.P8, pins.map(MSpeedValue, 0, 100, 0, 1000));
                pins.digitalWritePin(DigitalPin.P13, pins.map(McontrolValue, 0, 1, 0, 1));
                break;
            case 3:
                pins.analogWritePin(AnalogPin.P14, pins.map(MSpeedValue, 0, 100, 0, 1000));
                pins.digitalWritePin(DigitalPin.P15, pins.map(McontrolValue, 0, 1, 0, 1));
                break;
            case 4:
                pins.analogWritePin(AnalogPin.P16, pins.map(MSpeedValue, 0, 100, 0, 1000));
                pins.digitalWritePin(DigitalPin.P0, pins.map(McontrolValue, 0, 1, 0, 1));
                break;

        }
    }
  /**馬達腳位自行宣告
    */
    //% blockId=DDMmotor block="speed pin %MSpeedPin|speed (0~255) %MSpeedValue|direction pin %McontrolPin|rotation direction(0~1) %McontrolValue" blockExternalInputs=false
    //% McontrolValue.min=0 McontrolValue.max=1 
    //% MSpeedValue.min=0 MSpeedValue.max=255   
    //% MSpeedPin.fieldEditor="gridpicker" MSpeedPin.fieldOptions.columns=4
    //% MSpeedPin.fieldOptions.tooltips="false" MSpeedPin.fieldOptions.width="300"
    //% McontrolPin.fieldEditor="gridpicker" McontrolPin.fieldOptions.columns=4
    //% McontrolPin.fieldOptions.tooltips="false" McontrolPin.fieldOptions.width="300"
    //% group="Motor"
    export function DDMmotor(MSpeedPin: AnalogPin, MSpeedValue: number, McontrolPin: DigitalPin, McontrolValue: number): void {
        pins.analogWritePin(MSpeedPin, pins.map(MSpeedValue, 0, 255, 0, 1020));
        pins.digitalWritePin(McontrolPin, pins.map(McontrolValue, 0, 1, 0, 1));

    }

    ////////////////////////////////
    //          超音波            //
    ////////////////////////////////
    /**超音波註解
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig tigger pin
     * @param echo echo pin
     * @param unit desired conversion unit
     * @param maxCmDistance maximum distance in centimeters (default is 500)
     */

    //% blockId=sonar_ping block="trig pin %trig|echo pin %echo|unit %unit"
    //% group="Ultrasonic Sensor"
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
    ////////////////////////////////
    //          RGB LEDS          //
    ////////////////////////////////
    /**
         * Create a  RGB LED Pin.
         */
    //% blockId="RGBLED_create" block="pin %pin|"
    //% weight=100 blockGap=8
    //% trackArgs=0,2
    //% blockSetVariable=RGBLED
    //% subcategory="Add on pack"
    //% group="RGB LED"
    export function RGBLED_create(pin: DigitalPin): HaloHd {
        let RGBLED = new HaloHd();
        RGBLED.buf = pins.createBuffer(1 * 3);
        RGBLED.start = 0;
        RGBLED._length = 1;/*LED數量*/ 
        RGBLED.RGBLED_set_brightness(128)
        RGBLED.pin = pin;
        pins.digitalWritePin(RGBLED.pin ,pin);
        return RGBLED;
    }
    export class HaloHd {
        buf: Buffer;
        pin: DigitalPin;
        brightness: number;
        start: number;
        _length: number;


        

    
        /**
         * Shows whole ZIP Halo display as a given color (range 0-255 for r, g, b). 
         * @param rgb RGB color of the LED
         */
        //% subcategory="Add on pack"
         //% group="RGB LED"
        //% block="%RGBLED|show color %rgb=RGBLED_colors" 
        //% weight=99 blockGap=8
        RGBLED_set_color(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }

        

        /**
         * Send all the changes to the ZIP Halo display.
         */
        //% subcategory="Add on pack"
        //% group="RGB LED"
        /* blockId="kitronik_halo_hd_display_show" block="%RGBLED|show" blockGap=8 */
        //% weight=96
        show() {
            //use the Kitronik version which respects brightness for all 
            //ws2812b.sendBuffer(this.buf, this.pin, this.brightness);
            // Use the pxt-microbit core version which now respects brightness (10/2020)
            light.sendWS2812BufferWithBrightness(this.buf, this.pin, this.brightness);
        }

        /**
         * Turn off all LEDs on the ZIP Halo display.
         * You need to call ``show`` to make the changes visible.
         */
        //% subcategory="Add on pack"
        //% group="RGB LED"
        /* blockId="kitronik_halo_hd_display_clear" block="%RGBLED|clear" */
        //% weight=95 blockGap=8
        clear(): void {
            this.buf.fill(0, this.start * 3, this._length * 3);
        }

        /**
         * Set the brightness of the ZIP Halo display. This flag only applies to future show operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
         */
        //% subcategory="Add on pack"
        //% group="RGB LED"
        //% block="%RGBLED|set brightness %brightness" blockGap=8
        //% weight=92
        //% brightness.min=0 brightness.max=255
        RGBLED_set_brightness(brightness: number): void {
            //Clamp incoming variable at 0-255 as values out of this range cause unexpected brightnesses as the lower level code only expects a byte.
            if (brightness < 0) {
                brightness = 0
            }
            else if (brightness > 255) {
                brightness = 255
            }
            this.brightness = brightness & 0xff;
            basic.pause(1) //add a pause to stop wierdnesses
        }

        //Sets up the buffer for pushing LED control data out to LEDs
        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            this.buf[offset + 0] = green;
            this.buf[offset + 1] = red;
            this.buf[offset + 2] = blue;
        }

        //Separates out Red, Green and Blue data and fills the LED control data buffer for all LEDs
        private setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const end = this.start + this._length;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * 3, red, green, blue)
            }
        }

        //Separates out Red, Green and Blue data and fills the LED control data buffer for a single LED
        private setPixelRGB(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            pixeloffset = (pixeloffset + this.start) * 3;

            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            this.setBufferRGB(pixeloffset, red, green, blue)
        }
    }

    

    /**
     * Converts wavelength value to red, green, blue channels
     * @param wavelength value between 470 and 625. eg: 500
     */
    //% group="RGB LED"
    //% subcategory="Add on pack" 
    //% weight=1 blockGap=8
    /* blockId="kitronik_halo_hd_wavelength" block="wavelength %wavelength|nm" */
    //% wavelength.min=470 wavelength.max=625
    export function wavelength(wavelength: number): number {
        /*  The LEDs we are using have centre wavelengths of 470nm (Blue) 525nm(Green) and 625nm (Red) 
        * 	 We blend these linearly to give the impression of the other wavelengths. 
        *   as we cant wavelength shift an actual LED... (Ye canna change the laws of physics Capt)*/
        let r = 0;
        let g = 0;
        let b = 0;
        if ((wavelength >= 470) && (wavelength < 525)) {
            //We are between Blue and Green so mix those
            g = pins.map(wavelength, 470, 525, 0, 255);
            b = pins.map(wavelength, 470, 525, 255, 0);
        }
        else if ((wavelength >= 525) && (wavelength <= 625)) {
            //we are between Green and Red, so mix those
            r = pins.map(wavelength, 525, 625, 0, 255);
            g = pins.map(wavelength, 525, 625, 255, 0);
        }
        return packRGB(r, g, b);
    }

    /**
     * Converts hue (0-360) to an RGB value. 
     * Does not attempt to modify luminosity or saturation. 
     * Colours end up fully saturated. 
     * @param hue value between 0 and 360
     */
    //% subcategory="Add on pack"
    //% group="RGB LED"
    //% weight=1 blockGap=8
    /* blockId="kitronik_halo_hd_hue" block="hue %hue" */
    //% hue.min=0 hue.max=360
    export function hueToRGB(hue: number): number {
        let redVal = 0
        let greenVal = 0
        let blueVal = 0
        let hueStep = 2.125
        if ((hue >= 0) && (hue < 120)) { //RedGreen section
            greenVal = Math.floor((hue) * hueStep)
            redVal = 255 - greenVal
        }
        else if ((hue >= 120) && (hue < 240)) { //GreenBlueSection
            blueVal = Math.floor((hue - 120) * hueStep)
            greenVal = 255 - blueVal
        }
        else if ((hue >= 240) && (hue < 360)) { //BlueRedSection
            redVal = Math.floor((hue - 240) * hueStep)
            blueVal = 255 - redVal
        }
        return ((redVal & 0xFF) << 16) | ((greenVal & 0xFF) << 8) | (blueVal & 0xFF);
    }

    /*  The LEDs we are using have centre wavelengths of 470nm (Blue) 525nm(Green) and 625nm (Red) 
    * 	 We blend these linearly to give the impression of the other wavelengths. 
    *   as we cant wavelength shift an actual LED... (Ye canna change the laws of physics Capt)*/

    /**
     * Converts value to red, green, blue channels
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% subcategory="Add on pack"
    //% group="RGB LED"
    //% weight=1 blockGap=8
    //% blockId="rgb" block="red %red|green %green|blue %blue"
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
    //% subcategory="Add on pack" 
    //% group="RGB LED"
    //% weight=2 blockGap=8
    //% blockId="RGBLED_colors" block="%color" 
    export function colors(color: RGBLedColors): number {
        return color;
    }

    //Combines individual RGB settings to be a single number
    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    //Separates red value from combined number
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    //Separates green value from combined number
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    //Separates blue value from combined number
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /**
     * Converts a hue saturation luminosity value into a RGB color
     */
    function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    /**
     * Options for direction hue changes, used by rainbow block (never visible to end user)
     */
    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }

    ////////////////////////////////
    //          顏色感測器        //
    ////////////////////////////////
    //% weight=12
//% block="initialize color sensor"
//% subcategory="Add on pack" 
//% group="Color Sensor"
export function ColorSensorinit(): void {
    pins.i2cWriteNumber(41, 33276, NumberFormat.UInt16BE, false)
    pins.i2cWriteNumber(41, 32771, NumberFormat.UInt16BE, false)
}

/**
 * 補償系數，使用闭包确保只计算一次
 */
const whiteBalanceCompensation = (function () {
    let compensationValues: number[] | null = null;

    return function (): number[] {
        // 如果補償數值尚未計算，則進行計算
        if (compensationValues === null) {
            pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false);
            pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false);
            pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true);

            let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);

            pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true);
            let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);

            pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true);
            let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);

            TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255));
            TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255));
            TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255));

            let ra: number = TCS_RED;   // R 補償系數
            let ga: number = TCS_GREEN ; // G 補償系數
            let ba: number = TCS_BLUE ;  // B 補償系數
            ga +=20;
            ba +=20;

            // 將計算得到的補償數值存儲在全域變數中
            compensationValues = [ra, ga, ba];
        }

        // 返回補償數值
        return compensationValues;
    };
})();
    
    /**
    */
    let nowReadColor = [0, 0, 0];
    
    //% weight=12
    //% block="color sensor read color"
    //% subcategory="Add on pack"
    //% group="Color Sensor"
    export function ColorSensorReadColor(): void {
        // 在 ColorSensorReadColor 函數中呼叫 whiteBalanceCompensation 函數
        let compensationValues = whiteBalanceCompensation();
    
        pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false);
        pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false);
        pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true);
    
        let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);
    
        pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true);
        let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);
    
        pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true);
        let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);
    
        TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255));
        TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255));
        TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255));

        TCS_RED -= compensationValues[0];
        TCS_GREEN -= compensationValues[1];
        TCS_BLUE -= compensationValues[2];

        // 將讀取的顏色數據存回 nowReadColor
        nowReadColor = [TCS_RED, TCS_GREEN, TCS_BLUE];
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
//% block="color sensor read RGB %channel |channel"
//% subcategory="Add on pack"
//% group="Color Sensor"
export function ColorSensorRead(channel: Channel = 1): number {
    // 调用 whiteBalanceCompensation 获取补偿值
    const compensationValues = whiteBalanceCompensation();

    pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false);
    pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false);
    pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true);

    let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);
    pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true);
    let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);
    pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true);
    let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);

    let RdCl = 0;
    switch (channel) {
        case 1:
            TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255));
            TCS_RED -= compensationValues[0];
            RdCl = TCS_RED; 
            
            break;
        case 2:
            TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255));
            TCS_GREEN -= compensationValues[1];
            RdCl = TCS_GREEN;
            
            break;
        case 3:
            TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255));
            TCS_BLUE -= compensationValues[2];
            RdCl = TCS_BLUE;
            
            break;
    }

    return RdCl;
}
    export enum ColorPart {
        //% block="Red"
        Red = 1,
        //% block="Green"
        Green = 2,
        //% block="Blue"
        Blue = 3,
        //% block="Yellow"
        Yellow = 4,
        //% block="Purple"
        Purple = 5,
        //% block="Custom1"
        Custom1 = 6,
        //% block="Custom2"
        Custom2 = 7,
        //% block="Custom3"
        Custom3 = 8
    }

    let ReadRedColor = [0, 0, 0]
    let ReadGreenColor = [0, 0, 0]
    let ReadBlueColor = [0, 0, 0]
    let ReadYellowColor = [0, 0, 0]
    let ReadPurpleColor = [0, 0, 0]
    let ReadCustom1Color = [0, 0, 0]
    let ReadCustom2Color = [0, 0, 0]
    let ReadCustom3Color = [0, 0, 0]

    //% weight=12
    //% block="color sensor record %colorpart |"
    //% subcategory="Add on pack"
     //% group="Color Sensor"
     export function ColorSensorRecord(colorpart: ColorPart = 1): void {
        // 调用 whiteBalanceCompensation 获取补偿值
        const compensationValues = whiteBalanceCompensation();
    
        pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false);
        pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false);
        pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true);
    
        let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);
        pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true);
        let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);
        pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true);
        let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false);
    
        TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255));
        TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255));
        TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255));
    
        TCS_RED -= compensationValues[0];
        TCS_GREEN -= compensationValues[1];
        TCS_BLUE -= compensationValues[2];

        switch (colorpart) {
            case 1:
                ReadRedColor = [TCS_RED, TCS_GREEN, TCS_BLUE];
                break;
            case 2:
                ReadGreenColor = [TCS_RED, TCS_GREEN, TCS_BLUE];
                break;
            case 3:
                ReadBlueColor = [TCS_RED, TCS_GREEN, TCS_BLUE];
                break;
            case 4:
                ReadYellowColor = [TCS_RED, TCS_GREEN, TCS_BLUE];
                break;
            case 5:
                ReadPurpleColor = [TCS_RED, TCS_GREEN, TCS_BLUE];
                break;
            case 6:
                ReadCustom1Color = [TCS_RED, TCS_GREEN, TCS_BLUE];
                break;
            case 7:
                ReadCustom2Color = [TCS_RED, TCS_GREEN, TCS_BLUE];
                break;
            case 8:
                ReadCustom3Color = [TCS_RED, TCS_GREEN, TCS_BLUE];
                break;
        }
    }
     let colorright = false
    let forkrange = 10
    //% weight=12
    //% block="read color equal to %colorpart |"
    //% subcategory="Add on pack"
     //% group="Color Sensor"
    export function ReadColorEqual(colorpart: ColorPart = 1): boolean {
        switch (colorpart) {
            case 1:
                if ((Math.abs(ReadRedColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadRedColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadRedColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 2:
                if ((Math.abs(ReadGreenColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadGreenColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadGreenColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 3:
                if ((Math.abs(ReadBlueColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadBlueColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadBlueColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 4:
                if ((Math.abs(ReadYellowColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadYellowColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadYellowColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
          
            case 5:
                if ((Math.abs(ReadPurpleColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadPurpleColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadPurpleColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 6:
                if ((Math.abs(ReadCustom1Color[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadCustom1Color[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadCustom1Color[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 7:
                if ((Math.abs(ReadCustom2Color[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadCustom2Color[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadCustom2Color[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 8:
                if ((Math.abs(ReadCustom3Color[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadCustom3Color[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadCustom3Color[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
        }
        if (colorright == true) {
            return true
        }
        else {
            return false
        }
    }

}
