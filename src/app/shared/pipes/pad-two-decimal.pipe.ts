import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padTwoDecimal'
})
export class PadTwoDecimalPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return value.toFixed(2);
  }

}
