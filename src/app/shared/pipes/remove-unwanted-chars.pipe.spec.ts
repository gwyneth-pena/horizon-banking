import { RemoveUnwantedCharsPipe } from './remove-unwanted-chars.pipe';

describe('RemoveUnwantedCharsPipe', () => {
  it('create an instance', () => {
    const pipe = new RemoveUnwantedCharsPipe();
    expect(pipe).toBeTruthy();
  });
});
