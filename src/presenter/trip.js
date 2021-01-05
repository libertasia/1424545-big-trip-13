import SiteMenuView from "../view/site-menu.js";
import TripInfoView from "../view/trip-info.js";
import TripSortView from "../view/trip-sort.js";
import TripListView from "../view/trip-list.js";
import ListEmptyView from "../view/list-empty.js";
import NewButtonView from "../view/new-button.js";
import StatisticsView from "../view/statistics.js";
import LoadingView from "../view/loading.js";
import PointPresenter from "./point.js";
import NewPointPresenter from "./new-point.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {FilterType, SortType, UpdateType, UserAction, MenuItem} from "../const.js";
import {sortByDate, sortByTime, sortByPrice} from "../utils/sort.js";
import {filter} from "../utils/filter.js";

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripMenuContainer = document.querySelector(`.trip-main__trip-controls`);

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, destinationsModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._listEmptyComponent = new ListEmptyView();
    this._tripSortComponent = new TripSortView();
    this._tripListComponent = new TripListView();
    this._newButtonComponent = new NewButtonView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleNewButtonClick = this._handleNewButtonClick.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);

    this._newPointPresenter = new NewPointPresenter(this._tripListComponent, this._handleViewAction);
  }

  init() {
    console.log("trip:init");
    this._tripInfoComponent = new TripInfoView(this._getPoints());
    this._siteMenuComponent = new SiteMenuView();
    this._statsComponent = new StatisticsView(this._pointsModel.getPoints());
    this._newButtonComponent.setNewButtonClickHandler(this._handleNewButtonClick);
    this._siteMenuComponent.setMenuClickHandler(this._handleSiteMenuClick);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderNewButton();
    this._renderTrip();
  }

  destroy() {
    this._newPointPresenter.destroy();
    this._clearPointsList();
    remove(this._tripSortComponent);
    this._currentSortType = SortType.DEFAULT;

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return filteredPoints.sort(sortByDate);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints;
  }

  _renderSiteMenu() {
    render(tripMenuContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNewButton() {
    render(this._tripContainer, this._newButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(this._getPoints());
    render(this._tripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView();
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderList() {
    render(tripEventsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._destinationsModel);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._getPoints().forEach((point) => this._renderPoint(point));
  }

  _renderListEmpty() {
    render(tripEventsContainer, this._listEmptyComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(tripEventsContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTrip() {
    console.log("trip:_renderTrip");
    if (this._isLoading) {
      console.log("trip._isLoading");
      this._renderLoading();
      return;
    }
    console.log("loading rest of trip");

    this._renderSiteMenu();

    if (this._getPoints().length === 0) {
      this._renderListEmpty();
      return;
    }
    this._renderTripInfo();

    this._renderSort();

    this._renderList();

    this._renderPoints();
  }

  _clearPointsList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _clearTrip() {
    this._newPointPresenter.destroy();
    this._clearPointsList();
    remove(this._siteMenuComponent);
    remove(this._tripInfoComponent);
    remove(this._tripSortComponent);
    remove(this._tripListComponent);
    remove(this._loadingComponent);
    this._currentSortType = SortType.DEFAULT;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._newButtonComponent.getElement().disabled = false;
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
      case UserAction.CANCEL_ADD_POINT:
        this._newButtonComponent.getElement().disabled = false;
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearPointsList();
        this._renderPoints();
        break;
      case UpdateType.MAJOR:
        this._clearTrip();
        this.destroy();
        this.init();
        break;
      case UpdateType.INIT:
        console.log("got INIT");
        this._isLoading = false;
        remove(this._loadingComponent);
        this.init();
    }
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPoints();
  }

  _handleNewButtonClick() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this._siteMenuComponent.getActiveMenuItem() === MenuItem.STATS) {
      this._handleSiteMenuClick(MenuItem.TABLE);
    }
    this._newButtonComponent.getElement().disabled = true;
    this._newPointPresenter.init(this._destinationsModel);
  }

  _handleSiteMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.TABLE:
        remove(this._statsComponent);
        this._siteMenuComponent.setMenuItem(MenuItem.TABLE);
        this._clearTrip();
        this.init();
        break;
      case MenuItem.STATS:
        this._siteMenuComponent.setMenuItem(MenuItem.STATS);
        this.destroy();
        this._statsComponent = new StatisticsView(this._pointsModel.getPoints());
        render(tripEventsContainer, this._statsComponent, RenderPosition.BEFOREEND);
        break;
    }
  }
}
