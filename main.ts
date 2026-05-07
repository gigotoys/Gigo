// 在這裡添加你的程式
//% weight=0 color=#3CB371 icon="\uf2db" block="gigotools" groups='["Motor", "Ultrasound", "RGB LED", "Color Sensor", "Joystick"]'
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
namespace RoboticsWorkshop {

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
    //% subcategory="Add on pack 1"
    //% group="RGB LED"
    export function RGBLED_create(pin: DigitalPin): HaloHd {
        let RGBLED = new HaloHd();
        RGBLED.buf = pins.createBuffer(1 * 3);
        RGBLED.start = 0;
        RGBLED._length = 1;/*LED數量*/
        RGBLED.RGBLED_set_brightness(128)
        RGBLED.pin = pin;
        pins.digitalWritePin(RGBLED.pin, pin);
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
        //% subcategory="Add on pack 1"
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
        //% subcategory="Add on pack 1"
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
        //% subcategory="Add on pack 1"
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
        //% subcategory="Add on pack 1"
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
    //% subcategory="Add on pack 1" 
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
    //% subcategory="Add on pack 1"
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
    //% subcategory="Add on pack 1"
    //% group="RGB LED"
    //% weight=1 blockGap=8
    //% blockId="rgb" block="red %red|green %green|blue %blue"
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
    //% subcategory="Add on pack 1" 
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

    let sensorAddr = -1
    let currentSensor = 0
    let sensorReady = false
   

    enum SensorType {
        Unknown = 0,
        TCS3400 = 1,
        TCS3472 = 2
    }

    export enum Gain {
        //% block="1x"
        Gain1X = 0,
        //% block="4x"
        Gain4X = 1,
        //% block="16x"
        Gain16X = 2,
        //% block="60x / 64x"
        Gain60Or64X = 3
    }

    export enum DetectedSensor {
        //% block="unknown"
        Unknown = 0,
        //% block="TCS3400"
        TCS3400 = 1,
        //% block="TCS3472"
        TCS3472 = 2
    }

    export enum DetectedColor {
        //% block="unknown"
        Unknown = 0,
        //% block="black"
        Black = 1,
        //% block="white"
        White = 2,
        //% block="red"
        Red = 3,
        //% block="green"
        Green = 4,
        //% block="yellow"
        Yellow = 5,
        //% block="blue"
        Blue = 6,
        //% block="purple"
        Purple = 7
    }
    /**
   */
  ////////////////////////////////
    //          顏色感測器        //
    ////////////////////////////////
  // ==============================
    //顏色感測器初始化
    // ==============================
    //% weight=12
    //% block="initialize color sensor"
    //% subcategory="Add on pack 1" 
    //% group="Color Sensor"
    export function ColorSensorinit(): void {
        sensorReady = false
        sensorAddr = -1
        currentSensor = SensorType.Unknown

        // 固定參數（不顯示在積木）
        let gain = Gain.Gain16X
        let integration = 150

        currentSensor = detectSensor()

        if (currentSensor == SensorType.TCS3400) {
            tcs3400Init(sensorAddr, gain, integration)
            sensorReady = true
        }
        else if (currentSensor == SensorType.TCS3472) {
            tcs3472Init(sensorAddr, gain, integration)
            sensorReady = true
        }
    }
    /**
   */
    // ==============================
    // 顏色感測器讀取 通道數值
    // ==============================


    export enum Channel {
        //% block="R"
        Red = 1,
        //% block="G"
        Green = 2,
        //% block="B"
        Blue = 3
    }

    //% weight=14
    //% block="color sensor read RGB %channel channel"
    //% subcategory="Add on pack 1"
    //% group="Color Sensor"
    export function ColorSensorRead(channel: Channel = Channel.Red): number {

        if (!sensorReady) return 0

        let value = 0

        switch (channel) {
            case Channel.Red:
                value = readRedInternal()
                break

            case Channel.Green:
                value = readGreenInternal()
                break

            case Channel.Blue:
                value = readBlueInternal()
                break
        }

        // ⭐ 關鍵：轉換 16bit → 8bit
        value = Math.round(Math.map(value, 0, 65535, 0, 255))

        // ⭐ 保險（避免超界）
        if (value < 0) value = 0
        if (value > 255) value = 255

        return value
    }
    /**
   */
    // ==============================
    //顏顏色感測器讀取顏色數值
    // ==============================
    let nowReadColor = [0, 0, 0]

    //% weight=13
    //% block="color sensor read color"
    //% subcategory="Add on pack 1"
    //% group="Color Sensor"
    export function ColorSensorReadColor(): void {

        if (!sensorReady) return

        // ✅ 用統一底層（自動判斷 3400 / 3472）
        let TCS_RED = readRedInternal()
        let TCS_GREEN = readGreenInternal()
        let TCS_BLUE = readBlueInternal()


        // ⭐ 防呆：避免讀到 0 就亂寫
        if (TCS_RED == 0 && TCS_GREEN == 0 && TCS_BLUE == 0) {
            return
        }

        // ⭐ 標準化 0~255
        TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255))
        TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255))
        TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255))

        // ⭐ 限制範圍
        TCS_RED = Math.clamp(0, 255, TCS_RED)
        TCS_GREEN = Math.clamp(0, 255, TCS_GREEN)
        TCS_BLUE = Math.clamp(0, 255, TCS_BLUE)

        // ⭐ 更新全域變數（重點）
        nowReadColor[0] = TCS_RED
        nowReadColor[1] = TCS_GREEN
        nowReadColor[2] = TCS_BLUE
    }
    /**
   */
    // ==============================
    //顏顏色感測器紀錄顏色數值
    // ==============================


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

    // ==============================
    // Storage
    // ==============================
    let ReadRedColor = [0, 0, 0]
    let ReadGreenColor = [0, 0, 0]
    let ReadBlueColor = [0, 0, 0]
    let ReadYellowColor = [0, 0, 0]
    let ReadPurpleColor = [0, 0, 0]
    let ReadCustom1Color = [0, 0, 0]
    let ReadCustom2Color = [0, 0, 0]
    let ReadCustom3Color = [0, 0, 0]

    // ==============================
    // Record Function
    // ==============================

    //% weight=15
    //% block="color sensor record %colorpart"
    //% subcategory="Add on pack 1"
    //% group="Color Sensor"
    export function ColorSensorRecord(colorpart: ColorPart = ColorPart.Red): void {

        if (!sensorReady) return

        // ✅ 用統一底層（自動判斷 3400 / 3472）
        let TCS_RED = readRedInternal()
        let TCS_GREEN = readGreenInternal()
        let TCS_BLUE = readBlueInternal()


        // ---- Normalize 0~255 ----
        TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255))
        TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255))
        TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255))

        // ---- Clamp safety ----
        TCS_RED = Math.clamp(0, 255, TCS_RED)
        TCS_GREEN = Math.clamp(0, 255, TCS_GREEN)
        TCS_BLUE = Math.clamp(0, 255, TCS_BLUE)

        let rgb = [TCS_RED, TCS_GREEN, TCS_BLUE]

        // ---- Store by category ----
        switch (colorpart) {

            case ColorPart.Red:
                ReadRedColor = rgb
                break

            case ColorPart.Green:
                ReadGreenColor = rgb
                break

            case ColorPart.Blue:
                ReadBlueColor = rgb
                break

            case ColorPart.Yellow:
                ReadYellowColor = rgb
                break

            case ColorPart.Purple:
                ReadPurpleColor = rgb
                break

            case ColorPart.Custom1:
                ReadCustom1Color = rgb
                break

            case ColorPart.Custom2:
                ReadCustom2Color = rgb
                break

            case ColorPart.Custom3:
                ReadCustom3Color = rgb
                break
        }
    }
    /**
 */
    // ==============================
    //讀取R和G和B等於哪種顏色
    // ==============================
    let forkrange = 5

    // 取得對應儲存顏色
    function getStoredColor(part: ColorPart): number[] {
        switch (part) {
            case ColorPart.Red: return ReadRedColor
            case ColorPart.Green: return ReadGreenColor
            case ColorPart.Blue: return ReadBlueColor
            case ColorPart.Yellow: return ReadYellowColor
            case ColorPart.Purple: return ReadPurpleColor
            case ColorPart.Custom1: return ReadCustom1Color
            case ColorPart.Custom2: return ReadCustom2Color
            case ColorPart.Custom3: return ReadCustom3Color
        }
        return [0, 0, 0]
    }

    //% weight=99 blockGap=8
    //% block="read R %WriteRed|and G %WriteGreen|and B %WriteBlue equal to %colorpart"
    //% WriteRed.min=0 WriteRed.max=255
    //% WriteGreen.min=0 WriteGreen.max=255
    //% WriteBlue.min=0 WriteBlue.max=255
    //% subcategory="Add on pack 1"
    //% group="Color Sensor"
    export function ReadColorEqual(
        WriteRed: number,
        WriteGreen: number,
        WriteBlue: number,
        colorpart: ColorPart = ColorPart.Red
    ): boolean {

        // ⭐ 先更新目前讀值（關鍵！）
        ColorSensorReadColor()

        let stored = getStoredColor(colorpart)
        let input = [WriteRed, WriteGreen, WriteBlue]

        // ⭐ 比對「記錄顏色」
        let matchStored =
            Math.abs(stored[0] - nowReadColor[0]) < forkrange &&
            Math.abs(stored[1] - nowReadColor[1]) < forkrange &&
            Math.abs(stored[2] - nowReadColor[2]) < forkrange

        // ⭐ 比對「輸入顏色」
        let matchInput =
            Math.abs(input[0] - nowReadColor[0]) < forkrange &&
            Math.abs(input[1] - nowReadColor[1]) < forkrange &&
            Math.abs(input[2] - nowReadColor[2]) < forkrange

        return matchStored || matchInput
    }
    /**
*/
     // ==============================
    //TCS3400和TCS3472晶片辨識及I2C讀取 
    // ==============================
    // ----------------------------------------------

    function i2cWrite8(addr: number, reg: number, value: number): void {
        pins.i2cWriteBuffer(addr, pins.createBufferFromArray([reg, value]))
    }

    function i2cRead8(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE, true)
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE, false)
    }

    function i2cRead16LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE, true)
        let buf = pins.i2cReadBuffer(addr, 2, false)
        return buf[0] | (buf[1] << 8)
    }

    function clamp(v: number, lo: number, hi: number): number {
        if (v < lo) return lo
        if (v > hi) return hi
        return v
    }

    function colorDistance(rn: number, gn: number, bn: number, rr: number, rg: number, rb: number): number {
        let dr = rn - rr
        let dg = gn - rg
        let db = bn - rb
        return dr * dr + dg * dg + db * db
    }

    // ---------------- TCS3400 ----------------

    function tcs3400EncodeATime(ms: number): number {
        let cycles = Math.round(ms * 100 / 278)
        cycles = clamp(cycles, 1, 256)
        return 256 - cycles
    }

    function tcs3400DetectAt(addr: number): boolean {
        let id = 0
        i2cWrite8(addr, 0x80, 0x03)
        basic.pause(10)
        id = i2cRead8(addr, 0x92)
        return id == 0x90 || id == 0x93
    }

    function tcs3400Init(addr: number, gain: Gain, integrationMs: number): void {
        i2cWrite8(addr, 0x80, 0x00)
        basic.pause(3)
        i2cWrite8(addr, 0x81, tcs3400EncodeATime(integrationMs))
        i2cWrite8(addr, 0x8D, 0x40)
        i2cWrite8(addr, 0x8F, gain)
        i2cWrite8(addr, 0x90, 0x00)
        i2cWrite8(addr, 0x80, 0x01)
        basic.pause(3)
        i2cWrite8(addr, 0x80, 0x03)
        basic.pause(integrationMs + 10)
    }

    function tcs3400DataValid(addr: number): boolean {
        let status = i2cRead8(addr, 0x93)
        return (status & 0x01) != 0
    }

    function tcs3400ReadClear(addr: number): number {
        return i2cRead16LE(addr, 0x94)
    }

    function tcs3400ReadRed(addr: number): number {
        return i2cRead16LE(addr, 0x96)
    }

    function tcs3400ReadGreen(addr: number): number {
        return i2cRead16LE(addr, 0x98)
    }

    function tcs3400ReadBlue(addr: number): number {
        return i2cRead16LE(addr, 0x9A)
    }

    // ---------------- TCS3472 ----------------

    function tcs3472Cmd(reg: number): number {
        return 0x80 | reg
    }

    function tcs3472EncodeATime(ms: number): number {
        let cycles = Math.round(ms / 2.4)
        cycles = clamp(cycles, 1, 256)
        return 256 - cycles
    }

    function tcs3472DetectAt(addr: number): boolean {
        let id = 0
        i2cWrite8(addr, tcs3472Cmd(0x00), 0x03)
        basic.pause(10)
        id = i2cRead8(addr, tcs3472Cmd(0x12))
        return id == 0x44 || id == 0x4D
    }

    function tcs3472Init(addr: number, gain: Gain, integrationMs: number): void {
        i2cWrite8(addr, tcs3472Cmd(0x00), 0x00)
        basic.pause(3)
        i2cWrite8(addr, tcs3472Cmd(0x01), tcs3472EncodeATime(integrationMs))
        i2cWrite8(addr, tcs3472Cmd(0x0F), gain)
        i2cWrite8(addr, tcs3472Cmd(0x00), 0x01)
        basic.pause(3)
        i2cWrite8(addr, tcs3472Cmd(0x00), 0x03)
        basic.pause(integrationMs + 10)
    }

    function tcs3472DataValid(addr: number): boolean {
        let status = i2cRead8(addr, tcs3472Cmd(0x13))
        return (status & 0x01) != 0
    }

    function tcs3472ReadClear(addr: number): number {
        return i2cRead16LE(addr, tcs3472Cmd(0x14))
    }

    function tcs3472ReadRed(addr: number): number {
        return i2cRead16LE(addr, tcs3472Cmd(0x16))
    }

    function tcs3472ReadGreen(addr: number): number {
        return i2cRead16LE(addr, tcs3472Cmd(0x18))
    }

    function tcs3472ReadBlue(addr: number): number {
        return i2cRead16LE(addr, tcs3472Cmd(0x1A))
    }

    // ---------------- Detect / Common ----------------

    function detectSensor(): number {
        if (tcs3400DetectAt(0x39)) {
            sensorAddr = 0x39
            return SensorType.TCS3400
        }

        if (tcs3400DetectAt(0x29)) {
            sensorAddr = 0x29
            return SensorType.TCS3400
        }

        if (tcs3472DetectAt(0x29)) {
            sensorAddr = 0x29
            return SensorType.TCS3472
        }

        sensorAddr = -1
        return SensorType.Unknown
    }

    function sensorDataValid(): boolean {
        if (!sensorReady) return false

        if (currentSensor == SensorType.TCS3400) {
            return tcs3400DataValid(sensorAddr)
        } else if (currentSensor == SensorType.TCS3472) {
            return tcs3472DataValid(sensorAddr)
        }
        return false
    }

    function readClearInternal(): number {
        if (!sensorReady) return 0
        if (!sensorDataValid()) return 0

        if (currentSensor == SensorType.TCS3400) {
            return tcs3400ReadClear(sensorAddr)
        } else if (currentSensor == SensorType.TCS3472) {
            return tcs3472ReadClear(sensorAddr)
        }
        return 0
    }

    function readRedInternal(): number {
        if (!sensorReady) return 0
        if (!sensorDataValid()) return 0

        if (currentSensor == SensorType.TCS3400) {
            return tcs3400ReadRed(sensorAddr)
        } else if (currentSensor == SensorType.TCS3472) {
            return tcs3472ReadRed(sensorAddr)
        }
        return 0
    }

    function readGreenInternal(): number {
        if (!sensorReady) return 0
        if (!sensorDataValid()) return 0

        if (currentSensor == SensorType.TCS3400) {
            return tcs3400ReadGreen(sensorAddr)
        } else if (currentSensor == SensorType.TCS3472) {
            return tcs3472ReadGreen(sensorAddr)
        }
        return 0
    }

    function readBlueInternal(): number {
        if (!sensorReady) return 0
        if (!sensorDataValid()) return 0

        if (currentSensor == SensorType.TCS3400) {
            return tcs3400ReadBlue(sensorAddr)
        } else if (currentSensor == SensorType.TCS3472) {
            return tcs3472ReadBlue(sensorAddr)
        }
        return 0
    }
     ////////////////////////////////
 //          Joystick        //
 ////////////////////////////////

  export enum Dir {
    //% block="up"
    Up = 0,
    //% block="down"
    Down = 1,
    //% block="left"
    Left = 2,
    //% block="right"
    Right = 3,
    //% block="center"
    Center = 4,
    //% block="up left"
    UpLeft = 5,
    //% block="up right"
    UpRight = 6,
    //% block="down left"
    DownLeft = 7,
    //% block="down right"
    DownRight = 8
}

    let baseP1 = 512
    let baseP2 = 512
    let initialized = false

    const MOVE_THRESHOLD = 0.35
    const SNAP_CENTER = 0.2

    /**
     * 校正搖桿中心點
     */
    //% weight=99 blockGap=8
    //% block="calibrate joystick center"
    //% subcategory="Add on pack 2"
    //% group="Joystick"

    export function calibrate() {

        baseP1 = pins.analogReadPin(AnalogReadWritePin.P1)
        baseP2 = pins.analogReadPin(AnalogReadWritePin.P2)

        if (baseP1 < 100) baseP1 = 512
        if (baseP2 < 100) baseP2 = 512

        initialized = true
    }

    /**
     * 取得方向（即時回中 + 8方向）
     */
    export function getDirection(): Dir {

        if (!initialized) calibrate()

        let p1 = pins.analogReadPin(AnalogReadWritePin.P1)
        let p2 = pins.analogReadPin(AnalogReadWritePin.P2)

        let dx = (p2 - baseP2) / baseP2
        let dy = (p1 - baseP1) / baseP1

        // ⭐ 吸附中心（避免抖動）
        if (Math.abs(dx) < SNAP_CENTER) dx = 0
        if (Math.abs(dy) < SNAP_CENTER) dy = 0

        // =========================
        // 🎯 即時中心判斷（無延遲）
        // =========================
        if (dx == 0 && dy == 0) {
            return Dir.Center
        }

        // =========================
        // 🎮 4方向
        // =========================
        if (dy > MOVE_THRESHOLD && dx == 0) return Dir.Up
        if (dy < -MOVE_THRESHOLD && dx == 0) return Dir.Down
        if (dx < -MOVE_THRESHOLD && dy == 0) return Dir.Left
        if (dx > MOVE_THRESHOLD && dy == 0) return Dir.Right

        // =========================
        // 🎮 8方向
        // =========================
        if (dy > MOVE_THRESHOLD && dx > MOVE_THRESHOLD) return Dir.UpRight
        if (dy > MOVE_THRESHOLD && dx < -MOVE_THRESHOLD) return Dir.UpLeft
        if (dy < -MOVE_THRESHOLD && dx > MOVE_THRESHOLD) return Dir.DownRight
        if (dy < -MOVE_THRESHOLD && dx < -MOVE_THRESHOLD) return Dir.DownLeft

        return Dir.Center
    }

   /**
 * IF 判斷用
 */
//% weight=98 blockGap=8
//% block="joystick direction is %direction"
//% direction.shadow="RoboticsWorkshop.Dir"
//% subcategory="Add on pack 2"
//% group="Joystick"
export function isDirection(d: Dir): boolean {
    return getDirection() == d
}
    /**
     * 事件觸發
     */
    //% weight=97 blockGap=8
    //% block="when joystick direction is %direction"
    //% direction.shadow="RoboticsWorkshop.Dir"
    //% subcategory="Add on pack 2"
    //% group="Joystick"

    export function onJoystick(direction: Dir, handler: () => void) {

        control.inBackground(() => {

            let lastState = Dir.Center

            while (true) {

                let current = getDirection()

                if (current != lastState) {

                    if (current == direction) {
                        handler()
                    }

                    lastState = current
                }

                basic.pause(20)
            }
        })
    }
 
}
