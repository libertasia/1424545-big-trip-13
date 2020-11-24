import dayjs from "dayjs";

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

const createTripPointTemplate = (point) => {
  const {type, destination, price, startTime, endTime} = point;

  const date = dayjs(startTime).format(`MMM D`);
  const eventStartTime = dayjs(startTime).format(`HH:mm`);
  const eventEndTime = dayjs(endTime).format(`HH:mm`);

  const zeroPad = (num, places) => String(num).padStart(places, `0`);

  const getEventDuration = () => {
    const durationInMinutes = endTime.diff(startTime, `minute`);
    if (durationInMinutes < MINUTES_PER_HOUR) {
      return `${zeroPad(durationInMinutes, 2)}M`;
    } else if (durationInMinutes < MINUTES_PER_DAY) {
      const hours = Math.floor(durationInMinutes / MINUTES_PER_HOUR);
      const minutes = durationInMinutes % MINUTES_PER_HOUR;
      return `${zeroPad(hours, 2)}H ${zeroPad(minutes, 2)}M`;
    } else {
      const days = Math.floor(durationInMinutes / MINUTES_PER_DAY);
      const hours = Math.floor((durationInMinutes - days * MINUTES_PER_DAY) / MINUTES_PER_HOUR);
      const minutes = durationInMinutes - days * MINUTES_PER_DAY - hours * MINUTES_PER_HOUR;
      return `${zeroPad(days, 2)}D ${zeroPad(hours, 2)}H ${zeroPad(minutes, 2)}M`;
    }
  };

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startTime.toISOString()}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/flight.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTime.toISOString()}">${eventStartTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTime.toISOString()}">${eventEndTime}</time>
          </p>
          <p class="event__duration">${getEventDuration()}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Add luggage</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">30</span>
          </li>
          <li class="event__offer">
            <span class="event__offer-title">Switch to comfort</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">100</span>
          </li>
        </ul>
        <button class="event__favorite-btn" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export {createTripPointTemplate};
