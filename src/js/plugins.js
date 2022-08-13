// The Calculator
const betaCalc = {
    currentValue: 0,
    
    setValue(value) {
      this.currentValue = value;
      console.log(this.currentValue);
    },
   
    core: {
      'plus': (currentVal, addend) => currentVal + addend,
      'minus': (currentVal, subtrahend) => currentVal - subtrahend
    },
  
    plugins: {},    
  
    press(buttonName, newVal) {
      const func = this.core[buttonName] || this.plugins[buttonName];
      this.setValue(func(this.currentValue, newVal));
    },
  
    register(plugin) {
      const { name, exec } = plugin;
      this.plugins[name] = exec;
    }
  };
    
  // Our Plugin
  const squaredPlugin = { 
    name: 'squared',
    exec: (currentValue) => {
      return currentValue * currentValue;
    }
  };

  const multiplyPlugin = { 
    name: 'multiply',
    exec: (currentValue, multiend) => {
      return currentValue * multiend;
    }
  };

  const dividePlugin = { 
    name: 'divide',
    exec: (currentValue, diviend) => {
      return currentValue / diviend;
    }
  };

  const moduloPlugin = { 
    name: 'modulo',
    exec: (currentValue, end) => {
      return currentValue % end;
    }
  };
  
  betaCalc.register(squaredPlugin);
  betaCalc.register(multiplyPlugin);
  betaCalc.register(dividePlugin);
  betaCalc.register(moduloPlugin);

  // Using the calculator
  betaCalc.setValue(3);      // => 3
  betaCalc.press('plus', 2); // => 5
  betaCalc.press('squared'); // => 25
  betaCalc.press('squared'); // => 625
  betaCalc.press('multiply', 10); // => 625
  betaCalc.press('divide', 100); // => 625
  betaCalc.press('modulo', 10); // => 625

  console.log(Object.keys(betaCalc.plugins));