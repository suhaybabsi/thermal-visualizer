![alt text](https://thermal-visualizer.herokuapp.com/visualizer/img/gas_turbine_sample.png)

# Thermal-visualizer

A research visual tool to model and analyze thermal systems. Emphasizing on calculation aspects.

[View The Tool Online](https://thermal-visualizer.herokuapp.com/visualizer)

It uses [Thermal-core](https://github.com/suhaybabsi/thermal-core) framework to perform calculations on the back-end.

## Running Locally (Development Mode)

Make sure you have [Node.js](https://nodejs.org/) running on your machine.

```sh
$ git clone https://github.com/suhaybabsi/thermal-visualizer.git
$ cd thermal-visualizer
$ npm install
$ npm run dev
```

The app should now be running on [localhost:8081](http://localhost:8081/).

## Adding More Devices

Please have a look at the way devices are defined in file `source/Setup.js`. All device definitions are assigned to properties on object [`deviceConfigurations`](https://github.com/suhaybabsi/thermal-visualizer/blob/ca8db42bec38d5abd505687249df254bea441945/source/Setup.js#L186). See example below:

```javascript
compressor: {
    name: "Compressor",
    abbrev: "C",
    build: drawing.rhomboid("blue"),
    fields: [
        new Field("r", "Compression Ratio", 4.0, FieldType.SIMPLE),
        new Field("wc", "Work Consumed", null, FieldType.UNIT_COMBO, units.w),
        new Field("nc", "Polytropic Efficiency", null, FieldType.UNIT, percentUnit),
        new Field("Wrev", "Reversible Work", null, FieldType.UNIT_COMBO, units.w),
        new Field("Xdest", "Exergy Destruction", null, FieldType.UNIT_COMBO, units.w),
        new Field("Xeff", "Second Law Efficiency", null, FieldType.UNIT, percentUnit)
    ],
    outlets: [
        new OutletConfig(FlowType.Stream, FlowDirection.IN, 0, 0),
        new OutletConfig(FlowType.Stream, FlowDirection.OUT, 70, 20)
    ],
    couplings: [
        new CouplingConfig(30, ShaftOrientation.Horizontal)
    ]
},
```

Further explanation will come along soon. 

### Calculation logic

In order, for your device to get calculated. You must build the solver for the mathematical model of your device on your back-end. Use [Thermal-core](https://github.com/suhaybabsi/thermal-core) as a practical example.

### Graphic

Use one of the functions defined in `Builders.js` to assign a custom graphic builder to device definition. Those builders will be used whenever the device get created to build the visual graphics of it on screen.

### Contributing

If you'd like to share your newly created device, please consider making a [pull request](https://help.github.com/articles/creating-a-pull-request/)