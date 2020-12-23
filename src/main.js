import {generatePoint} from "./mock/point.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const tripMainContainer = document.querySelector(`.trip-main`);
// const newEventBtn = tripMainContainer.querySelector(`.trip-main__event-add-btn`);

const filterModel = new FilterModel();

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripPresenter = new TripPresenter(tripMainContainer, pointsModel);
tripPresenter.init();
