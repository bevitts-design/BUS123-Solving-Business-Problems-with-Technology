const activityData = {
  title: "Break-Even Simulator",
  inputs: [
    { id: "price", label: "Price", value: 25, min: 5, max: 100 },
    { id: "variableCost", label: "Variable Cost", value: 10, min: 1, max: 75 },
    { id: "fixedCost", label: "Fixed Cost", value: 5000, min: 500, max: 20000 }
  ],
  outputs: [
    {
      id: "breakEvenUnits",
      label: "Break-even units",
      formula: "fixedCost / (price - variableCost)"
    }
  ]
};
