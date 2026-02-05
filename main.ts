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
        let h = readReg(cm
