import { GridState, GridTopology } from '../types/grid';
import { PowerSource } from '../types/powerSources';
import { Customer } from '../types/customers';
import * as fs from 'fs';
import * as path from 'path';

export class DataLoader {
  // TODO: Implement the loadGridTopology method
  // Copilot Prompt: "Implement the loadGridTopology method. Read the grid-topology.json file, parse it as JSON, and return it as a GridTopology object."
  public static loadGridTopology(): GridTopology {
    const jsonPath = path.resolve(__dirname, '../../data/grid-topology.json');
    const jsonText = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(jsonText);
  }

  // TODO: Implement the loadPowerSources method
  // Copilot Prompt: "Implement the loadPowerSources method. Read the power-sources.json file, parse it as JSON, and return it as an array of PowerSource objects."
  public static loadPowerSources(): PowerSource[] {
    const jsonPath = path.resolve(__dirname, '../../data/power-sources.json');
    const jsonText = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(jsonText);
  }

  // TODO: Implement the loadCustomers method
  // Copilot Prompt: "Implement the loadCustomers method. Read the customers.json file, parse it as JSON, and return it as an array of Customer objects."
  public static loadCustomers(): Customer[] {
    const jsonPath = path.resolve(__dirname, '../../data/customers.json');
    const jsonText = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(jsonText).customers;

  }

  // TODO: Implement the getCurrentGridState method
  // Copilot Prompt: "Implement the getCurrentGridState method. Combine the topology, power sources, and customer data to create a complete GridState object. Calculate the total demand and supply."
  public static getCurrentGridState(): GridState {
    const topology = this.loadGridTopology();
    const powerSources = this.loadPowerSources();
    const customers = this.loadCustomers();

    const totalDemandMW = customers.reduce((total, customer) => total + customer.typicalLoadMW, 0);
    const totalSupplyMW = powerSources.reduce((total, source) => total + source.currentOutputMW, 0);

    return {
      topology,
      timestamp: new Date(),
      totalDemandMW,
      totalSupplyMW,
    };
  }
}
