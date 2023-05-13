export interface InputData {
    qualitycontrol?:  QualityControl;
    sellwish?:        SellWish;
    selldirect?:      SellDirect;
    orderlist?:       OrderList;
    productionlist?:  ProductionList;
    workingtimelist?: WorkingTimeList;
}

export interface OrderList {
    order: Order[];
}

export interface Order {
    _article:  number;
    _quantity: number;
    _modus:    number;
}

export interface ProductionList {
    production: Production[];
}

export interface Production {
    _article:  number;
    _quantity: number;
}

export interface QualityControl {
    _type:         string;
    _losequantity: number;
    _delay:        number;
}

export interface SellDirect {
    item: Item[];
}

export interface Item {
    _article:  number;
    _penalty:  number;
    _price:    number;
    _quantity: number;
}

export interface SellWish {
    item: Production[];
}

export interface WorkingTimeList {
    workingtime: WorkingTime[];
}

export interface WorkingTime {
    _station:  number;
    _shift:    number;
    _overtime: number;
    _suggestion: number;
    _setuptime: number;
    _processingtime: number;
}
