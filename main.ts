/**
 * Dual Color Sensor Extension
 * Support: TCS3472 / BL-MZ-PBS06212D-010X
 */

enum ColorIC {
    NONE,
    TCS3472,
    BL_MZ
}

let colorIC: ColorIC = ColorIC.NONE
let i2cAddr = 0x00

//% color="#FF8800" icon="\uf53f" block="Color Sensor"
namespace ColorSensor {

    // ===== Low level I2C =====
    function writeReg(reg: number, val: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = val
        pins.i2cWriteBuffer(i2cAddr, buf)
    }

    function readReg(reg: number): number {
        pins.i2cWriteNumber(i2cAddr, reg, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8BE)
    }

    function cmd(reg: number): number {
        return (colorIC == ColorIC.TCS3472) ? (0x80 | reg) : reg
    }

    function read16(lo: number): number {
        let l = readReg(cmd(lo))
        let h = readReg(cmd(lo + 1))
        return (h << 8) | l
    }

    // ===== Detect IC =====
    function detect(): boolean {
        // TCS3472
        i2cAddr = 0x29
        let id = readReg(0x92)
        if (id == 0x44 || id == 0x4D) {
            colorIC = ColorIC.TCS3472
            return true
        }

        // BL-MZ ADDR low
        i2cAddr = 0x42
        id = readReg(0x82)
        if (id == 0x24) {
            colorIC = ColorIC.BL_MZ
            return true
        }

        // BL-MZ ADDR float
        i2cAddr = 0x43
        id = readReg(0x82)
        if (id == 0x24) {
            colorIC = ColorIC.BL_MZ
            return true
        }

        colorIC = ColorIC.NONE
        return false
    }

    //% block="initialize color sensor"
    export function begin(): boolean {
        if (!detect()) return false

        if (colorIC == ColorIC.TCS3472) {
            writeReg(cmd(0x00), 0x01) // PON
            basic.pause(3)
            writeReg(cmd(0x00), 0x03) // AEN
            writeReg(cmd(0x0F), 0x02) // AGAIN 16x
        } else {
            writeReg(0x80, 0x03) // PON + RGB_EN
            basic.pause(20)
            writeReg(0x81, 0b00000100) // AGAIN=1x, RGB=100ms
        }
        return true
    }

    //% block="red value"
    export function red(): number {
        return (colorIC == ColorIC.TCS3472) ? read16(0x16) : read16(0xA0)
    }

    //% block="green value"
    export function green(): number {
        return (colorIC == ColorIC.TCS3472) ? read16(0x18) : read16(0xA2)
    }

    //% block="blue value"
    export function blue(): number {
        return (colorIC == ColorIC.TCS3472) ? read16(0x1A) : read16(0xA4)
    }

    //% block="clear value"
    export function clear(): number {
        return (colorIC == ColorIC.TCS3472) ? read16(0x14) : read16(0xA6)
    }

    //% block="detected sensor type"
    export function sensorType(): string {
        if (colorIC == ColorIC.TCS3472) return "TCS3472"
        if (colorIC == ColorIC.BL_MZ) return "BL-MZ"
        return "NONE"
    }
}
