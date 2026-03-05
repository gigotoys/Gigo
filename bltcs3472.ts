namespace BLTCS3472 {

    const ADDR = 0x21

    function writeReg(reg: number, value: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(ADDR, buf)
    }

    function read16(reg: number): number {
        pins.i2cWriteNumber(ADDR, reg, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(ADDR, NumberFormat.UInt16LE)
    }

    //% block="init BL color sensor"
    export function init(): void {
        writeReg(0x80, 0x03)   // PON + RGB_EN
        basic.pause(10)
        writeReg(0x81, 0x13)   // 80ms + 1.5x
        basic.pause(100)
    }

    //% block="Red"
    export function red(): number {
        return read16(0xA0)
    }

    //% block="Green"
    export function green(): number {
        return read16(0xA2)
    }

    //% block="Blue"
    export function blue(): number {
        return read16(0xA4)
    }

    //% block="Clear"
    export function clear(): number {
        return read16(0xA6)
    }

    //% block="IR"
    export function ir(): number {
        return read16(0xA8)
    }

    //% block="Lux"
    export function lux(): number {
        let r = red()
        let g = green()
        let b = blue()
        return (r * 0.136) + (g * 1.0) + (b * -0.444)
    }

    //% block="Color Temperature"
    export function colorTemp(): number {
        let r = red()
        let b = blue()
        if (r == 0) return 0
        let ratio = b / r
        return (3810 * ratio) + 1391
    }
}