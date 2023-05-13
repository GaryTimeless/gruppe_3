export interface Results {
  completedorders: Completedorders;
  cycletimes: Cycletimes;
  forecast: Forecast;
  futureinwardstockmovement: FutureInwardStockMovement;
  idletimecosts: Idletimecosts;
  inwardstockmovement: InwardStockMovement;
  ordersinwork: OrdersInWork;
  result: Result;
  waitinglistworkstations: WaitingListWorkstations;
  waitingliststock: string;
  warehousestock: WarehouseStock;
  _game: string;
  _group: string;
  _period: string;
}

export interface Completedorders {
  order: CompletedordersOrder[];
}

export interface CompletedordersOrder {
  batch: Batch[];
  _averageunitcosts: number;
  _cost: number;
  _id: number;
  _item: number;
  _period: number;
  _quantity: number;
}

export interface Batch {
  _id: number;
  _amount: number;
  _cost: number;
  _cycletime: number;
}

export interface Cycletimes {
  order: CycletimesOrder[];
  _startedorders: number;
  _waitingorders: number;
}

export interface CycletimesOrder {
  _id: number;
  _period: number;
  _cycletimemin: number;
  _cycletimefactor: number;
  _finishtime: string;
  _starttime: string;
}

export class Forecast {
  _p1?: number;
  _p2?: number;
  _p3?: number;
}

export interface FutureInwardStockMovement {
  order: FutureInwardStockMovementOrder[];
}

export interface FutureInwardStockMovementOrder {
  _id: number;
  _amount: number;
  _article: number;
  _mode: number;
  _orderperiod: number;
}

export interface Idletimecosts {
  sum: Sum;
  workplace: Workplace[];
}

export interface Sum {
  _idletime: number;
  _machineidletimecosts: number;
  _setupevents: number;
  _wagecosts: number;
  _wageidletimecosts: number;
}

export interface Workplace {
  _id: number;
  _idletime: number;
  _machineidletimecosts: number;
  _setupevents: number;
  _wagecosts: number;
  _wageidletimecosts: number;
}

export interface InwardStockMovement {
  order: InwardStockMovementOrder[];
}

export interface InwardStockMovementOrder {
  _id: number;
  _amount: number;
  _article: number;
  _entirecosts: number;
  _materialcosts: number;
  _mode: number;
  _ordercosts: number;
  _orderperiod: number;
  _piececosts: number;
  _time: number;
}

export interface OrdersInWork {
  workplace: OrdersInWorkWorkplace[] | OrdersInWorkWorkplace;
}

export interface OrdersInWorkWorkplace {
  _id: number;
  _amount: number;
  _batch: number;
  _item: number;
  _order: number;
  _period: number;
  _timeneed: number;
}

export interface Result {
  defectivegoods: CostsQuantity;
  directsale: DirectSale;
  general: GeneralResult;
  marketplacesale: MarketplaceSale;
  normalsale: NormalSale;
  summary: CostsQuantity;
}

export interface CostsQuantity {
  costs: AllAverageCurrent;
  quantity: AllAverageCurrent;
}

export interface GeneralResult {
  capacity: AllAverageCurrent;
  deliveryreliability: AllAverageCurrent;
  effiency: AllAverageCurrent;
  idletime: AllAverageCurrent;
  idletimecosts: AllAverageCurrent;
  possiblecapacity: AllAverageCurrent;
  productivetime: AllAverageCurrent;
  relpossiblenormalcapacity: AllAverageCurrent;
  salesquantity: AllAverageCurrent;
  sellwish: AllAverageCurrent;
  storagecosts: AllAverageCurrent;
  storevalue: AllAverageCurrent;
}

export interface AllAverageCurrent {
  _current: string;
  _average: string;
  _all: string;
}

export interface DirectSale {
  contractpenalty: AllAverageCurrent;
  profit: AllAverageCurrent;
}

export interface MarketplaceSale {
  profit: AllAverageCurrent;
}

export interface NormalSale {
  salesprice: AllAverageCurrent;
  profit: AllAverageCurrent;
  profitperunit: AllAverageCurrent;
}

export interface WaitingListWorkstations {
  workplace: WaitingListWorkstationsWorkplace[];
}

export interface WaitingListWorkstationsWorkplace {
  _id: number;
  _timeneed: number;
  waitinglist?: WaitingListElement[] | WaitingListElement;
}

export interface WaitingListElement {
  _amount: number;
  _firstbatch: number;
  _item: number;
  _lastbatch: number;
  _order: number;
  _period: number;
  _timeneed: number;
}

export interface WarehouseStock {
  article: Article[];
  totalstockvalue: number;
}

export interface Article {
  _id: number;
  _amount: number;
  _pct: number;
  _price: number;
  _startamount: number;
  _stockvalue: number;
}

