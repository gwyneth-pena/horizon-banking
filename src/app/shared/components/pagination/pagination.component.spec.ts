import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show proper current page upon clicking "Next" or "Previous"', () => {
    fixture.componentRef.setInput('totalPages', 3);
    fixture.componentRef.setInput('page', 1);
    fixture.detectChanges();

    expect(component.pages().length).toBe(3);
    expect(component.pages()).toEqual([1, 2, 3]);

    component.handleClick(component.currentPage() + 1);
    expect(component.currentPage()).toBe(2);

    component.handleClick(component.currentPage() - 1);
    expect(component.currentPage()).toBe(1);

    const prevButton =
      fixture.debugElement.nativeElement.querySelector('#prev-btn');
    const nextButton =
      fixture.debugElement.nativeElement.querySelector('#next-btn');

    prevButton.click();
    fixture.detectChanges();
    expect(component.currentPage()).toBe(0);
    expect(prevButton.attributes.getNamedItem('disabled'));

    nextButton.click();
    fixture.detectChanges();
    expect(component.currentPage()).toBe(1);

    nextButton.click();
    fixture.detectChanges();
    expect(component.currentPage()).toBe(2);

    nextButton.click();
    fixture.detectChanges();
    expect(component.currentPage()).toBe(3);

    nextButton.click();
    fixture.detectChanges();

    expect(nextButton.attributes.getNamedItem('disabled'));
  });
});
