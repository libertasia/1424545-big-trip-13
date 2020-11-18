import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripMenuTemplate} from "./view/trip-menu.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createTripSortTemplate} from "./view/trip-sort.js";
import {createTripListTemplate} from "./view/trip-list.js";
import {createEditPointTemplate} from "./view/trip-edit-point.js";
import {createNewPointTemplate} from "./view/trip-new-point.js";
import {createTripPointTemplate} from "./view/trip-point.js";

const POINT_COUNT = 3;

const tripMainContainer = document.querySelector(`.trip-main`);
const tripMenuContainer = tripMainContainer.querySelector(`.trip-main__trip-controls`);
const tripEventsSection = document.querySelector(`.trip-events`);

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

render(tripMainContainer, createTripInfoTemplate(), `afterbegin`);
render(tripMenuContainer, createTripMenuTemplate(), `afterbegin`);
render(tripMenuContainer, createTripFiltersTemplate(), `beforeend`);
render(tripEventsSection, createTripSortTemplate(), `afterbegin`);
render(tripEventsSection, createTripListTemplate(), `beforeend`);

const tripList = tripEventsSection.querySelector(`.trip-events__list`);

render(tripList, createEditPointTemplate(), `afterbegin`);
render(tripList, createNewPointTemplate(), `beforeend`);

for (let i = 0; i < POINT_COUNT; i++) {
  render(tripList, createTripPointTemplate(), `beforeend`);
}
