import { InputData, Production } from './input-data.model';
import { Forecast, FutureInwardStockMovementOrder, Results } from './result-data.model';


export interface Bestellposition {
  _artikelnummer: number;
  _lieferkosten: number;
  _lieferzeit: number;
  _lieferzeitabweichung: number;
  _startpreis: number;
  _diskontmenge: number;
  _verwendung: {p1: number, p2:number, p3: number};
  _bestellmengeNormal: number;
  _bestellmengeEil: number;
  _lagerbestand: any;
  _prog1: number;
  _prog2: number;
  _prog3: number;
  _prog4: number;
  _bestellungZuSpaet: number;
  _ausstehendeBestellungen: FutureInwardStockMovementOrder[];


}
