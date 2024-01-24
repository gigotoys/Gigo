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
//% weight=12
//% block="white balance compensation"

export function WhiteBalanceCompensation(): number[] {
    let compensationValues: number[] | null = null;

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
}
