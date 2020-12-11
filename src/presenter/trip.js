import SiteMenuView from "../view/site-menu.js";
import TripFiltersView from "../view/trip-filters.js";
import TripInfoView from "../view/trip-info.js";
import TripSortView from "../view/trip-sort.js";
import TripListView from "../view/trip-list.js";
import ListEmptyView from "../view/list-empty.js";
import PointPresenter from "./point.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {SortType} from "../const.js";
import {sortByDate, sortByTime, sortByPrice} from "../utils/sort.js";

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripMenuContainer = document.querySelector(`.trip-main__trip-controls`);

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._listEmptyComponent = new ListEmptyView();
    this._tripSortComponent = new TripSortView();
    this._tripListComponent = new TripListView();
    this._pointChangeHandler = this._pointChangeHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._tripPoints.sort(sortByDate);

    this._tripInfoComponent = new TripInfoView(this._tripPoints);
    this._siteMenuComponent = new SiteMenuView();
    this._tripFiltersComponent = new TripFiltersView();
    this._renderTrip();
  }

  _renderSiteMenu() {
    render(tripMenuContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilters() {
    render(tripMenuContainer, this._tripFiltersComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    render(this._tripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _renderList() {
    render(tripEventsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._pointChangeHandler, this._modeChangeHandler);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._tripPoints.forEach((point) => this._renderPoint(point));
  }

  _clearPointsList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderListEmpty() {
    render(tripEventsContainer, this._listEmptyComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTrip() {
    this._renderSiteMenu();

    this._renderFilters();

    if (this._tripPoints.length === 0) {
      this._renderListEmpty();
      return;
    }
    this._renderTripInfo();

    this._renderSort();

    this._renderList();

    this._renderPoints();
  }

  _pointChangeHandler(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _modeChangeHandler() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DEFAULT:
        this._tripPoints.sort(sortByDate);
        break;
      case SortType.TIME:
        this._tripPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._tripPoints.sort(sortByPrice);
        break;
    }
    this._currentSortType = sortType;
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);

    this._clearPointsList();

    this._renderPoints();
  }
}
