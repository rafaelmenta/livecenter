import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  /**
   * Current system date snapshot
   */
  private today = new Date();

  /**
   * User date selection. Defaults to current system date.
   */
  private selectedDate = this.today;

  /**
   * Dates being shown on carousel
   */
  carouselDates: Date[] = [];

  @Output() dateChanged = new EventEmitter<Date>();

  constructor() { }

  get isToday() {
    return this.selectedDate === this.today;
  }

  ngOnInit() {
    this.selectToday();
    this.carouselDates = this.getCarouselDates(this.selectedDate);
  }

  /**
   * Given a seed date, generate a carousel containing previous and next dates related to a certain
   * one.
   *
   * @param seed center date of the carousel
   * @return list of dates
   */
  getCarouselDates(seed: Date) {
    const time = seed.getTime();

    return [-2, -1, 0, 1, 2].map(day => {
      const shiftDate = new Date(time);
      shiftDate.setDate(shiftDate.getDate() + day);
      return shiftDate;
    });
  }

  isSelected(date: Date) {
    return this.selectedDate.getTime() === date.getTime();
  }

  rotateForward() {
    this.rotate(this.carouselDates[3]);
  }

  rotateBackward() {
    this.rotate(this.carouselDates[1]);
  }

  selectToday() {
    this.selectDate(this.today);
    this.rotate(this.selectedDate);
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.dateChanged.emit(this.selectedDate);
  }

  private rotate(seed: Date) {
    this.carouselDates = this.getCarouselDates(seed);
  }

}
