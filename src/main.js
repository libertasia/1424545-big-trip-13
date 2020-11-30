import TripInfoView from "./view/trip-info.js";
import SiteMenuView from "./view/site-menu.js";
import TripFiltersView from "./view/trip-filters.js";
import TripSortView from "./view/trip-sort.js";
import TripListView from "./view/trip-list.js";
import TripEditPointView from "./view/trip-edit-point.js";
import TripNewPointView from "./view/trip-new-point.js";
import TripPointView from "./view/trip-point.js";
import ListEmptyView from "./view/list-empty.js";
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

const renderPoint = (pointListElement, point) => {
  const pointComponent = new TripPointView(point);
  const pointEditComponent = new TripEditPointView(point);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceCardToForm = () => {
    pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToCard();
  });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const tripMainContainer = document.querySelector(`.trip-main`);
const tripMenuContainer = tripMainContainer.querySelector(`.trip-main__trip-controls`);

render(tripMenuContainer, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);
render(tripMenuContainer, new TripFiltersView().getElement(), RenderPosition.BEFOREEND);

const renderTripBoard = (tripPoints) => {
  const tripEventsSection = document.querySelector(`.trip-events`);

  if (tripPoints.length === 0) {
    render(tripEventsSection, new ListEmptyView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  } else {
    render(tripMainContainer, new TripInfoView(tripPoints).getElement(), RenderPosition.AFTERBEGIN);
    render(tripEventsSection, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);

    const tripListComponent = new TripListView();
    render(tripEventsSection, tripListComponent.getElement(), RenderPosition.BEFOREEND);
    render(tripListComponent.getElement(), new TripNewPointView().getElement(), RenderPosition.BEFOREEND);

    for (let i = 0; i < POINT_COUNT; i++) {
      renderPoint(tripListComponent.getElement(), tripPoints[i]);
    }
  }
};

renderTripBoard(points);
