![alt text](/visualizer/img/gas_turbine_sample.png)

# Thermal-visualizer

A research tool developed as an initiative to define an extensible and consistent visual way to model and analyze thermal systems, emphasizing on calculation aspects.

It uses [Thermal-core](https://github.com/suhaybabsi/thermal-core) framework to perform calculations on the back-end. Hit the following link to experiment with the tool.

[VIEW THE TOOL ONLINE](https://thermal-visualizer.herokuapp.com/visualizer)

## Technologies Used
* Javascript (ES6/Harmony) with [Babel](https://babeljs.io/) used as a transpiler.
* [ReactJS](https://reactjs.org/) used to build dynamic forms to edit devices and flows properties.
* [PaperJS](http://paperjs.org/) used to build the 2D diagrams of thermal systems.
* [Webpack](https://webpack.js.org/) used to bundle scripts and resources for web. 

## Running Locally (Development Mode)

Make sure you have [Node.js](https://nodejs.org/) running on your machine. Then run the following command on Terminal (Mac OS X) or Commad Prompts (Windows).

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

### Fields

Define device properties using `Field` instances. Notice that it takes a `type` as a 4th parameter. Use this to specifiy how the property should be presented on forms:

1. `.UNIT_COMBO`: The property will be displayed as a numeric value with a measurement unit that could be converted to others. For example, property Temperature will be represented as text input with a dropdown of measurement units (°F, °C and K).

2. `.UNIT`: The property will be displayed as a numeric value with certain measurement unit. For example, property Efficiency will be represented as text input with a label of the measurement unit (%).

3. `.SIMPLE`: The property will be displayed as a numeric value only.

4. `.UNIT_COMBO_LABEL`: The property will be displayed exactly like in `.UNIT_COMBO` type. Except that the user <b>won't</b> be able to edit the value.


### Flows & Pipes

Flows are used to represent the state of the substance (gas or liquid) streaming in or out a device. While `Pipe` is a thermal device like any other device. <i>Please refer to project [Thermal-core](https://github.com/suhaybabsi/thermal-core) to learn more about the concept</i>. And since we need to represent `Pipes` here the same way as `Flows`, the values `FlowType.Stream` and `FlowType.Pipe` were used to distinguish between them.

So, when ever a `Flow` is created, its type should be specified as `Pipe` or `Stream`. Then, those flows will be later treated on server accordingly.

### Outlets

You can't define `Flow` type and properties directly. A `Flow` could be instaniated by providing two `Outlets` to the constructor function.

```javascript
let flow = new Flow(turbine.flowOutlets[1], exhaust.flowOutlets[0]);
```

`OutletConfig` are used to define how many flows the device can take in or out, and where -in graphic- should the line of flows be drawn from. Those objects will be used to create device's `Outlet`s whenever get instaniated:

```javascript
let compressor = new Device("compressor");
let oulet1 = compressor.flowOutlets[0]; //Access device flow outlets here.
```

### Calculation logic

In order, for your device to get calculated. You must build the solver for the mathematical model of your device on your back-end. Use [Thermal-core](https://github.com/suhaybabsi/thermal-core) as a practical example.

### Graphic

Use one of the functions defined in `Builders.js` to assign a custom graphic builder to device definition. Those builders will be used whenever the device get created to build the visual graphics of it on screen.

### Contributing

If you'd like to share your newly created device, please consider making a [pull request](https://help.github.com/articles/creating-a-pull-request/)