# Water Tank Meter

## 2006 - First Iteration - Capacitance Probe

While attending HSU in 2006, I took *IT251: Industrial Control Electronics*. Looking for a final project, my Dad had pointed out that him and his partner could use an automated water tank reading tool. They live in a wooden 5 story water tower that has been converted to a residence down in Mendocino County. The 6000 gallon water tank on the top floor is their supply. To fill it, they manually turned on a pump and then listened for when the overflow would start running down the side of the house.

So I did some research and found this cool design that used PTFE insulated wire to build a capacitance probe in which the insulation is the dialectric and the wire and the water form the capacitor. Measuring the capacitance of the wire then tells the depth of the water - provided the wire is run to to bottom of the tank in a continuous loop to avoid corrosion. Details on that attempt are at [HSU Courses: IT251](hsu_courses.md).

Long story short - I didn't get it working.

## 2019 - Second Iteration - Ultrasonic Sensor

In 2019, I finally got around to buying myself an oscilloscope and variable power supply and building out my [electronics workbench](workbench.md). Excited to get back to my projects, which I had previously only been able to do while borrowing lab time at universities, I began with the Water Tank Meter. I reviewed the original capacitance probe design. I bought some PTFE insulated wire and tried to measure its capacitance. It was going to complicated! So I looked around and thought maybe I could get away with using an ultrasonic distance sensor from the top of the tank looking down into the water. I confirmed that the tank empties and fills from the bottom which ensures that the top should remain relatively smooth.

### Parts list

* [Raspberry Pi Zero W](https://www.raspberrypi.com/products/raspberry-pi-zero-w/)
* [Ultrasonic Distance Sensor HC-SR04 Compatible](https://www.adafruit.com/product/4007)
* [16GB Card with NOOBS 3.0](https://www.adafruit.com/product/1583)
* 12V Power Cable

### Build

I had always wanted to use a Raspberry Pi so I picked up the cheapest one I could find with Wifi - the [Raspberry Pi Zero W](https://www.raspberrypi.com/products/raspberry-pi-zero-w/). After a bit of setup and wrestling with the wireless configuration files, I got the device setup and was excited to ssh into it over wifi.

I picked up a cheap ultrasonic sensor and in a storke of luck, it turned out that the Pi Zero W had output voltage pins that matched the input needs of the sensor, so I didn't need to build a voltage divider or do any additional circuitry. I bought a small box to put it all in and borrowed some shop time at my friend's shop to use his drill press to make the ultrasonic sensor holes as precise as possible.

### Code

Most of the code I wrote for this project is available in a repository on GitHub at [Eukota/IoT](https://github.com/eukota/iot). We deployed

### Installation

We preconfigured the device to prefer my Dad's wireless network with mine second so that I could ship him the device. After it was installed, I set up a family [Slack](https://slack.com/) group and app and configured a CRON job to post the last logged data point once per hour to a Slack channel.

### Travel and Usage

We got the system working just before my Dad and his partner travelled to France. As the water tank also supplies water to their rental, it was important that they be able to know the water level so they could more accurately fill the tank as needed - by asking a neighbor to turn the pump on! LOL!

## 2021 Update

My Dad got a new router and this required me to update the system to connect to it. It is all live again. My next projects include:

1. Adding commands to the Slack bot
1. Updating the output to calculate approximate water remaining instead of the current "inches above water" that the sensor is outputting.
1. Build a GrafiteDB to log the data to and put Grafana in front of it

## 2023 Update

I applied a few updates

1. Added gallons printout - oddly Raspian python was not happy with f-strings
1. Refactored a lot of the python to be more utility-like - but also wrote more hacky things
