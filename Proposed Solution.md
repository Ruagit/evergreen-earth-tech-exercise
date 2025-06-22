
# Overview

Propose a solution to the problem statement listed in the Readme of this project. The solution proposed will be a Node service which provides a summary based on the calculcations and processing of the provided house, heat pump and external data. The service should consider error handling, edge cases for missing data and testing for logic contained in the service. The output will be displayed in the console for the purposes of this project using node's console api.

Testing will be done to cover the logic contained in the service and 3rd party api's will not be tested as their functionality is outside of our control.

## How it works


Install dependencies

```zsh
npm install
```

Format with Prettier

```zsh
npm run format
```
Start application

```zsh
npm run start
```

Run tests

```zsh
npm run test
```

Expected Out for Summary

```
Processing house: b0ec94b6-ca15-4fb2-9ec7-7017f43080f4
 
--------------------------------------
b0ec94b6-ca15-4fb2-9ec7-7017f43080f4
--------------------------------------
 
  Estimated Heat Loss       = 30758.1 kWh
  Design Region             = W Scotland (Abbotsinch)
  Power Heat Loss           = 12.33 kW
  Recommended Heat Pump     = 16kW Package
  Cost Breakdown
 
    Design & Supply of your Air Source Heat Pump System Components (16kW) - £5421
    Installation of your Air Source Heat Pump and Hot Water Cylinder - £2900
    Supply & Installation of your Homely Smart Thermostat - £150
    Supply & Installation of a new Consumer Unit - £300
    MCS System Commissioning & HIES Insurance-backed Warranty - £1648
 
  Total Cost, including VAT = £10939.95

```


### Considerations aand Improvements
- Generate summary and save it to a file or generate document rather than displaying summary with console logs
- Use environment variables to store sensitive data like API_KEY instead of hardcoding them.
- Using TypeScript would improve type safety and make the code easier to maintain. We could define interfaces for house, heat-pumps, and weather data.
- Improve error handling - potentially using throw error incorrectly and/or to much.
- In heatPumpSelection we iterate over all hest pumps, if this list is large it could be an expensive operation. We could consider ordering this data and then we could better filter over a smaller set of data.
- If house data and heat pumps list grew significantly we would need to consider batching requests or using some type of stream process.
- We could benefit from caching results from the weather api for the design region.


### Assumptions

I have built this assuming no further calculations should happen for the house in that location that fails. However subsequent houses can be processed.
```
The provided API was built by a third party and somewhat strange behaviour has been reported in some cases - we are assured this will not be a problem in production. Additionally, some regions are not yet supported by the API, if the designRegion cannot be found by the API (it should return a 404 in this case), then the following output is expected, and further calculations should not be attempted.

```