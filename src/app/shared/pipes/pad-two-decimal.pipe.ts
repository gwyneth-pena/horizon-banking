import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padTwoDecimal'
})
export class PadTwoDecimalPipe implements PipeTransform {

  transform(value: number|string, ...args: unknown[]): unknown {
    value = typeof value === 'string' ? parseFloat(value) : value;
    if(value) return value?.toFixed(2);
    return '';
  }

}
