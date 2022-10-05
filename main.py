def alerte_feu():
    for index in range(10):
        strip.set_pixel_color(index, neopixel.colors(NeoPixelColors.RED))
        strip.shift(1)
        strip.show()
        basic.pause(50)
    pins.digital_write_pin(DigitalPin.P9, 1)

def on_button_pressed_b():
    control.reset()
input.on_button_pressed(Button.B, on_button_pressed_b)

heure = 0
minutes = 0
Connecte = 0
ruban = 0
strip: neopixel.Strip = None
basic.show_icon(IconNames.YES)
secondes2 = 0
flamme = 0
ESP8266ThingSpeak.connect_wifi(SerialPin.P0,
    SerialPin.P1,
    BaudRate.BAUD_RATE115200,
    "Pixel6",
    "bpax1108")
OLED12864_I2C.init(60)
strip = neopixel.create(DigitalPin.P2, 10, NeoPixelMode.RGB)
strip.set_brightness(255)
strip.show_color(neopixel.colors(NeoPixelColors.ORANGE))

def on_forever():
    global flamme
    OLED12864_I2C.show_number(0, 0, flamme, 1)
    if ESP8266ThingSpeak.is_last_upload_successful():
        OLED12864_I2C.show_string(4, 0, "D", 1)
    else:
        OLED12864_I2C.show_string(4, 0, "X", 1)
    if ESP8266ThingSpeak.is_thing_speak_connected():
        OLED12864_I2C.show_string(6, 0, "T", 1)
    else:
        OLED12864_I2C.show_string(6, 0, "X", 1)
    if ESP8266ThingSpeak.is_wifi_connected():
        OLED12864_I2C.show_string(8, 0, "W", 1)
    else:
        OLED12864_I2C.show_string(8, 0, "X", 1)
    if pins.digital_read_pin(DigitalPin.P12) == 1:
        flamme += 1
    if pins.digital_read_pin(DigitalPin.P13) == 1:
        flamme += 1
    if pins.digital_read_pin(DigitalPin.P14) == 1:
        flamme += 1
    if pins.digital_read_pin(DigitalPin.P15) == 1:
        flamme += 1
    if pins.digital_read_pin(DigitalPin.P16) == 1:
        flamme += 1
basic.forever(on_forever)

def on_forever2():
    while ruban == 0 and Connecte == 1:
        strip.show_color(neopixel.colors(NeoPixelColors.BLUE))
        strip.clear()
        basic.pause(200)
        strip.show_color(neopixel.colors(NeoPixelColors.BLUE))
basic.forever(on_forever2)

def on_forever3():
    global Connecte
    if ESP8266ThingSpeak.is_wifi_connected():
        OLED12864_I2C.show_string(0, 2, "Wifi--ok----", 1)
        if ESP8266ThingSpeak.is_last_upload_successful() and ESP8266ThingSpeak.is_thing_speak_connected():
            Connecte = 1
basic.forever(on_forever3)

def on_forever4():
    if flamme >= 100:
        strip.clear()
        alerte_feu()
basic.forever(on_forever4)

def on_forever5():
    global ruban, minutes, heure
    basic.show_string("" + str((Connecte)))
    if input.button_is_pressed(Button.A) and Connecte == 1:
        ruban = 1
        strip.clear()
        for index2 in range(120):
            for secondes22 in range(60):
                basic.pause(1000)
                if secondes22 == 59:
                    minutes += 1
                    if minutes == 59:
                        heure += 1
                OLED12864_I2C.show_string(0,
                    1,
                    "" + str(heure) + "h " + str(minutes) + "m " + str(secondes22) + "s",
                    1)
basic.forever(on_forever5)

def on_forever6():
    if Connecte == 1:
        OLED12864_I2C.show_string(0, 3, "Thsp---ok---", 1)
    else:
        OLED12864_I2C.show_string(0, 3, "Connect-Thsp", 1)
basic.forever(on_forever6)

def on_forever7():
    if ruban == 1 and flamme <= 100:
        for index3 in range(10):
            strip.set_pixel_color(index3, neopixel.colors(NeoPixelColors.GREEN))
            strip.shift(1)
            strip.show()
            basic.pause(50)
basic.forever(on_forever7)

def on_every_interval():
    ESP8266ThingSpeak.connect_thing_speak("api.thingspeak.com",
        "8BQMST83OZ7LV6OT",
        input.temperature(),
        flamme,
        minutes,
        0,
        0,
        0,
        0,
        0)
loops.every_interval(5000, on_every_interval)
