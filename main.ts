function alerte_feu () {
    for (let index = 0; index <= 9; index++) {
        strip.setPixelColor(index, neopixel.colors(NeoPixelColors.Red))
        strip.shift(1)
        strip.show()
        basic.pause(50)
    }
    pins.digitalWritePin(DigitalPin.P9, 1)
}
input.onButtonPressed(Button.B, function () {
    basic.showLeds(`
        # # # # .
        # . . # .
        # # # # .
        # . # . .
        # . . # .
        `)
    control.reset()
})
let heure = 0
let minutes = 0
let Connecte = 0
let ruban = 0
let strip: neopixel.Strip = null
basic.showIcon(IconNames.Yes)
let secondes2 = 0
let flamme = 0
ESP8266ThingSpeak.connectWifi(
SerialPin.P0,
SerialPin.P1,
BaudRate.BaudRate115200,
"Pixel6",
"bpax1108"
)
OLED12864_I2C.init(60)
strip = neopixel.create(DigitalPin.P2, 10, NeoPixelMode.RGB)
strip.setBrightness(255)
strip.showColor(neopixel.colors(NeoPixelColors.Orange))
basic.forever(function () {
    OLED12864_I2C.showNumber(
    0,
    0,
    flamme,
    1
    )
    if (ESP8266ThingSpeak.isLastUploadSuccessful()) {
        OLED12864_I2C.showString(
        4,
        0,
        "D",
        1
        )
    } else {
        OLED12864_I2C.showString(
        4,
        0,
        "X",
        1
        )
    }
    if (ESP8266ThingSpeak.isThingSpeakConnected()) {
        OLED12864_I2C.showString(
        6,
        0,
        "T",
        1
        )
    } else {
        OLED12864_I2C.showString(
        6,
        0,
        "X",
        1
        )
    }
    if (ESP8266ThingSpeak.isWifiConnected()) {
        OLED12864_I2C.showString(
        8,
        0,
        "W",
        1
        )
    } else {
        OLED12864_I2C.showString(
        8,
        0,
        "X",
        1
        )
    }
    if (pins.digitalReadPin(DigitalPin.P12) == 1) {
        flamme += 1
    }
    if (pins.digitalReadPin(DigitalPin.P13) == 1) {
        flamme += 1
    }
    if (pins.digitalReadPin(DigitalPin.P14) == 1) {
        flamme += 1
    }
    if (pins.digitalReadPin(DigitalPin.P15) == 1) {
        flamme += 1
    }
    if (pins.digitalReadPin(DigitalPin.P16) == 1) {
        flamme += 1
    }
})
basic.forever(function () {
    while (ruban == 0 && Connecte == 1) {
        strip.showColor(neopixel.colors(NeoPixelColors.Blue))
        strip.clear()
        basic.pause(200)
        strip.showColor(neopixel.colors(NeoPixelColors.Blue))
    }
})
basic.forever(function () {
    if (ESP8266ThingSpeak.isWifiConnected()) {
        OLED12864_I2C.showString(
        0,
        2,
        "Wifi--ok----",
        1
        )
        if (ESP8266ThingSpeak.isLastUploadSuccessful() && ESP8266ThingSpeak.isThingSpeakConnected()) {
            Connecte = 1
        }
    }
})
basic.forever(function () {
    if (minutes >= 2 && flamme <= 100) {
        strip.clear()
        strip.showColor(neopixel.colors(NeoPixelColors.Orange))
        strip.show()
    }
})
basic.forever(function () {
    if (flamme >= 100) {
        strip.clear()
        alerte_feu()
    }
})
basic.forever(function () {
    basic.showString("" + (Connecte))
    if (input.buttonIsPressed(Button.A) && Connecte == 1) {
        ruban = 1
        strip.clear()
        for (let index = 0; index < 5; index++) {
            for (let secondes2 = 0; secondes2 <= 59; secondes2++) {
                basic.pause(1000)
                if (secondes2 == 59) {
                    minutes += 1
                    if (minutes == 59) {
                        heure += 1
                        minutes = 0
                    }
                }
                OLED12864_I2C.showString(
                0,
                1,
                "" + heure + "h " + minutes + "m " + secondes2 + "s",
                1
                )
            }
        }
    }
})
basic.forever(function () {
    if (Connecte == 1) {
        OLED12864_I2C.showString(
        0,
        3,
        "Thsp---ok---",
        1
        )
    } else {
        OLED12864_I2C.showString(
        0,
        3,
        "Connect-Thsp",
        1
        )
    }
})
basic.forever(function () {
    if (ruban == 1 && flamme <= 100 && minutes < 2) {
        for (let index = 0; index <= 9; index++) {
            strip.setPixelColor(index, neopixel.colors(NeoPixelColors.Green))
            strip.shift(1)
            strip.show()
            basic.pause(50)
        }
    }
})
loops.everyInterval(5000, function () {
    ESP8266ThingSpeak.connectThingSpeak(
    "api.thingspeak.com",
    "8BQMST83OZ7LV6OT",
    input.temperature(),
    flamme,
    minutes,
    0,
    0,
    0,
    0,
    0
    )
})
