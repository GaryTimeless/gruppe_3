export interface workingtimeDetails{
    _newOrders: newOrders[];
    _waitinglist: number;
    _ordersInWork: number;
    _setuptimeOld: number;
    _setuptimeNew: number;
}

export interface newOrders{
    _item: string;
    _quantity: number;
    _processingtime: number;
}