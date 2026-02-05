namespace ColorSensor {

    enum SensorType {
        Unknown = 0,
        TCS3472 = 1,
        BLMZ = 2
    }

    let sensorType: SensorType = SensorType.Unknown

    const TCS_ADDR = 0x29
    const BLMZ_ADDR = 0x43

    //% block="initialize color sensor (auto detect)"
    //% subcategory="Add on pack"
    //% group="Color Sensor"
    export function init(): void {
        // Try TCS3472
        try {
            pins.i2cWriteNumber(TCS_ADDR, 0x12, NumberFormat.UInt8BE, true)
            let id = pins.i2cReadNumber(TCS_ADDR, NumberFormat.UInt8BE, false)
            if (id == 0x44) {
                sensorType = SensorType.TCS3472
                initTCS()
                return
            }
        } catch { }

        // Try BL-MZ
        try {
            pins.i2cWriteNumber(BLMZ_ADDR, 0x82, NumberFormat.UInt8BE, true)
            let id = pins.i2cReadNumber(BLMZ_ADDR, NumberFormat.UInt8BE, false)
            if (id == 0x24) {
                sensorType = SensorType.BLMZ
                initBLMZ()
                return
            }
        } catch { }

        sensorType = SensorType.Unknown
    }

    function initTCS(): void {
        pins.i2cWriteNumber(TCS_ADDR, 0x8003, NumberFormat.UInt16BE)
        pins.i2cWriteNumber(TCS_ADDR, 0x8100, NumberFormat.UInt16BE)
    }

    function initBLMZ(): void {
        pins.i2cWriteNumber(BLMZ_ADDR, 0x8003, NumberFormat.UInt16BE)
        pins.i2cWriteNumber(BLMZ_ADDR, 0x8144, NumberFormat.UInt16BE)
    }

    function read16(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE, true)
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE, false)
    }

    function readRedRaw(): number {
        return sensorType == SensorType.TCS3472
            ? read16(TCS_ADDR, 0x96)
            : read16(BLMZ_ADDR, 0xA0)
    }

    function readGreenRaw(): number {
        return sensorType == SensorType.TCS3472
            ? read16(TCS_ADDR, 0x98)
            : read16(BLMZ_ADDR, 0xA2)
    }

    function readBlueRaw(): number {
        return sensorType == SensorType.TCS3472
            ? read16(TCS_ADDR, 0x9A)
            : read16(BLMZ_ADDR, 0xA4)
    }

    //% block="read color %channel"
    //% subcategory="Add on pack"
    //% group="Color Sensor"
    export function read(channel: Channel): number {
        let v = 0
        switch (channel) {
            case Channel.Red:
                v = readRedRaw()
                break
            case Channel.Green:
                v = readGreenRaw()
                break
            case Channel.Blue:
                v = readBlueRaw()
                break
        }
        return Math.round(Math.map(v, 0, 65535, 0, 255))
    }
}
