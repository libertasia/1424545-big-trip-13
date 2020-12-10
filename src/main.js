import SiteMenuView from "./view/site-menu.js";
import TripFiltersView from "./view/trip-filters.js";
// import TripNewPointView from "./view/trip-new-point.js";
import {generatePoint} from "./mock/point.js";
import TripPresenter from "./presenter/trip.js";
import {render, RenderPosition} from "./utils/render.js";

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

render(tripMenuContainer, new SiteMenuView(), RenderPosition.AFTERBEGIN);
render(tripMenuContainer, new TripFiltersView(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripMainContainer);
tripPresenter.init(points);
