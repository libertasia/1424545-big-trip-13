import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import Api from "./api.js";
import {UpdateType} from "./const.js";

const AUTHORIZATION = `Basic vhz0YftSgpDVoqPot`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripMainContainer = document.querySelector(`.trip-main`);
const tripMenuContainer = tripMainContainer.querySelector(`.trip-main__trip-controls`);

const api = new Api(END_POINT, AUTHORIZATION);

const filterModel = new FilterModel();

const pointsModel = new PointsModel();
api.getPoints()
  .then((points) => {
    console.log("received points, sending INIT");
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch((e) => {
    console.log(`catch, sending INIT. ${e}`);
    pointsModel.setPoints(UpdateType.INIT, []);
  });

const destinationsModel = new DestinationsModel();
api.getDestinations().then((destinations) => {
  destinationsModel.setDestinations(UpdateType.INIT, destinations);
});

const tripPresenter = new TripPresenter(tripMainContainer, pointsModel, filterModel, destinationsModel);
const filterPresenter = new FilterPresenter(tripMenuContainer, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();
