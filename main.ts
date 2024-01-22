/**
 * NFC reader
 */
//% weight=10 color=#1d8045 icon="\uf0e7" block="NFC"
namespace NFC {
    let myNFCevent: Action = null;
    let receivedLen = 0;
    let password = pins.createBuffer(6);
    let receivedBuffer = pins.createBuffer(25);
    let uid = pins.createBuffer(4);
    let myRxPin = SerialPin.P2;  // 将 RX 设置为 P2
    let myTxPin = SerialPin.P1;  // 将 TX 设置为 P1
    let init = false;
    password[0] = 0xFF;
    password[1] = 0xFF;
    password[2] = 0xFF;
    password[3] = 0xFF;
    password[4] = 0xFF;
    password[5] = 0xFF;

    //% advanced=true shim=NFC::RxBufferedSize
    function RxBufferedSize(): number {
        return 1
    }

    function wakeup(): void {
        let myBuffer: number[] = [];
        myBuffer = [0x55, 0x55, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x03, 0xfd, 0xd4,
            0x14, 0x01, 0x17, 0x00];
        let wake = pins.createBufferFromArray(myBuffer);
        serial.writeBuffer(wake);
        basic.pause(50);
        receivedLen = RxBufferedSize();
        if (receivedLen == 15) {
            receivedBuffer = serial.readBuffer(15);
        }
    }

    /**
     * Setup DFRobot NFC module Tx Rx to micro:bit pins.
     * 設定DFRobot的Tx、Rx連接腳位
     * @param pinTX to pinTX ,eg: SerialPin.P1
     * @param pinRX to pinRX ,eg: SerialPin.P2
    */
    //% weight=100
    //% blockId="NFC_setSerial" block="set NFC TX to %pinTX | RX to %pinRX at 9600 bps"
    export function NFC_setSerial(pinTX: SerialPin, pinRX: SerialPin): void {
        myRxPin = pinRX;
        myTxPin = pinTX;
        serial.redirect(
            myRxPin,
            myTxPin,
            BaudRate.BaudRate9600  // 将波特率更改为 9600 bps
        )
        init = true;
    }

    //% weight=95
    //% blockId="NFC_disconnect" block="NFC disconnect"
    export function NFC_disconnect(): void {
        init = false;
    }

    //% weight=94
    //% blockId="NFC_reconnect" block="NFC reconnect"
    export function NFC_reconnect(): void {
        serial.redirect(
            myRxPin,
            myTxPin,
            BaudRate.BaudRate9600  // 将波特率更改为 9600 bps
        )
        init = true;
    }

    //% weight=90
    //% blockId="nfcEvent" block="When RFID card is detected"
    export function nfcEvent(tempAct: Action) {
        myNFCevent = tempAct;
    }

    //% weight=80
    //% blockId="getUID" block="RFID UID string"
    export function getUID(): string {
        serial.setRxBufferSize(100)
        wakeup();
        let myBuffer: number[] = []
        let uidBuffer: number[] = []
        myBuffer = [0x00, 0x00, 0xFF, 0x04, 0xFC, 0xD4, 0x4A, 0x01, 0x00, 0xE1, 0x00]
        let cmdUID = pins.createBufferFromArray(myBuffer)
        serial.writeBuffer(cmdUID);
        basic.pause(50);
        receivedLen = RxBufferedSize();
        if (receivedLen == 25) {
            receivedBuffer = serial.readBuffer(25);
            for (let i = 0; i < 4; i++) {
                uid[i] = receivedBuffer[19 + i];
            }

            if (uid[0] == uid[1] && uid[1] == uid[2] && uid[2] == uid[3] && uid[3] == 0xFF) {
                return "";
            } else {
                uidBuffer = [uid[0], uid[1], uid[2], uid[3]];
