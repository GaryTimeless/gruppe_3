import { InputData, Production, WorkingTime } from './input-data.model';
import { Bestellposition } from './order.model copy';
import { Forecast, Results } from './result-data.model';
import { workingtimeDetails } from './workingtime.model';

export class Planning {
  name?: string;
  result?: Results; // Achtung Ergebnis letzte Periode
  input: InputData = {
    qualitycontrol: {
      _type: 'no',
      _losequantity: 0,
      _delay: 0,
    },
  };

  sellwish: PeriodsWithForecast = {
    period1: {},
    period2: {},
    period3: {},
  };
  productionPlanning = new ProductionPlanningProducts();
  //   selldirect: {},
  planningo: PlanningValues = {
    disposition1: {},
    disposition2: {},
    disposition3: {},
  };

  productionorders: ProductionOrders = {
    disposition1: [],
    disposition2: [],
    disposition3: [],
    initNumber: 0,
  };
  // selldirect: {},
  production: {
    defaultOrder?: Production[];
    afterSplitting?: Production[];
    currentSplit?: Production[];
  } = {};
  workingtime: {
    defaultWorkingtime?: WorkingTime[];
    updatedWorkingtime?: WorkingTime[];
    defaultWorkingtimeDetails?: workingtimeDetails[];
  } = {};
  order: { bestellung?: { [key: string]: Bestellposition } } = {};
  //   summary: {},

  done = {
    sellwish: false,
    selldirect: false,
    production: false,
    order: false,
    workingtime: false,
  };

  constructor(obj: any = {}) {
    Object.assign(this, obj);
  }
}

export class ProductionPlanningProducts {
  _p1 = new ProductionPlanningPeriods();
  _p2 = new ProductionPlanningPeriods();
  _p3 = new ProductionPlanningPeriods();
}
export class ProductionPlanningPeriods {
  period0: ProductionPlanning = new ProductionPlanning();
  period1: ProductionPlanning = new ProductionPlanning();
  period2: ProductionPlanning = new ProductionPlanning();
  period3: ProductionPlanning = new ProductionPlanning();
}
export class ProductionPlanning {
  production?: number;
  plannedStock?: number;
}

export interface PeriodsWithForecast {
  period1: Forecast;
  period2: Forecast;
  period3: Forecast;
}
export interface ProductionOrders {
  disposition1: Disposition[];
  disposition2: Disposition[];
  disposition3: Disposition[];
  initNumber: number;
}

export interface Disposition {
  _id: number;
  _amount: number;
}

export interface PlanningValues {
  disposition1: {
    _nummer1?: number | undefined;
    _nummer2?: number | undefined;
    _nummer3?: number | undefined;
    _nummer4?: number;
    _nummer5?: number;
    _nummer6?: number;
    _nummer7?: number;
    _nummer8?: number;
    _nummer9?: number;
    _nummer10?: number;
    _nummer11?: number;
    _nummer12?: number;
  };
  disposition2: {
    _nummer1?: number;
    _nummer2?: number;
    _nummer3?: number;
    _nummer4?: number;
    _nummer5?: number;
    _nummer6?: number;
    _nummer7?: number;
    _nummer8?: number;
    _nummer9?: number;
    _nummer10?: number;
    _nummer11?: number;
    _nummer12?: number;
  };
  disposition3: {
    _nummer1?: number;
    _nummer2?: number;
    _nummer3?: number;
    _nummer4?: number;
    _nummer5?: number;
    _nummer6?: number;
    _nummer7?: number;
    _nummer8?: number;
    _nummer9?: number;
    _nummer10?: number;
    _nummer11?: number;
    _nummer12?: number;
  };
}
