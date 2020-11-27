import TripInfoView from "./view/trip-info.js";
import SiteMenuView from "./view/site-menu.js";
import TripFiltersView from "./view/trip-filters.js";
import TripSortView from "./view/trip-sort.js";
import TripListView from "./view/trip-list.js";
import TripEditPointView from "./view/trip-edit-point.js";
import TripNewPointView from "./view/trip-new-point.js";
import TripPointView from "./view/trip-point.js";
import {generatePoint} from "./mock/point.js";
import {render, RenderPosition} from "./utils.js";

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generatePoint);
points.sort((a, b) => {
  if (a.startTime.isBefore(b.startTime)) {
    return -1;
  }
  if (a.startTime.isAfter(b.startTime)) {
    return 1;
  }
  return 0;
});

const tripMainContainer = document.querySelector(`.trip-main`);
const tripMenuContainer = tripMainContainer.querySelector(`.trip-main__trip-controls`);
const tripEventsSection = document.querySelector(`.trip-events`);

render(tripMainContainer, new TripInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
render(tripMenuContainer, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);
render(tripMenuContainer, new TripFiltersView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsSection, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);
render(tripEventsSection, new TripListView().getElement(), RenderPosition.BEFOREEND);

const tripList = tripEventsSection.querySelector(`.trip-events__list`);

render(tripList, new TripEditPointView(points[0]).getElement(), RenderPosition.AFTERBEGIN);
render(tripList, new TripNewPointView().getElement(), RenderPosition.BEFOREEND);

for (let i = 1; i < POINT_COUNT; i++) {
  render(tripList, new TripPointView(points[i]).getElement(), RenderPosition.BEFOREEND);
}
