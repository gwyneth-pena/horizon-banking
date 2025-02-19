import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnwantedChars'
})
export class RemoveUnwantedCharsPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value) return value.replace(/[^a-zA-Z0-9\s]/g, '');
    return '';
  }

}
