export const calcVerhaeltnis = (
  dispositionNr: number,
  productionPlanning: any,
  value: string
) => {
  const produktion =
    productionPlanning['_p' + dispositionNr].period0.production;
  let produktionSumme = 0;

  const produktionMap: any = {};
  for (let i in productionPlanning) {
    produktionMap[i] = productionPlanning[i].period0.production;
    produktionSumme += productionPlanning[i].period0.production;
  }

  const verhaeltnis: number = produktion / produktionSumme;

  switch (dispositionNr) {
    case 1:
      const i2 = Number.parseInt(
        (
          ((produktionMap._p2 / produktionSumme) *
          Number.parseInt(value))/10
        ).toString()
      )*10;
      const i3 = Number.parseInt(
        (
          ((produktionMap._p3 / produktionSumme) *
          Number.parseInt(value))/10
        ).toString()
      )*10;
      return Number.parseInt(value) - i2 - i3;
    default:
      return Number.parseInt(((verhaeltnis * Number.parseInt(value))/10).toString())*10;
  }
};
