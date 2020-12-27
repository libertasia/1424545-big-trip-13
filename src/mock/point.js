import {getRandomInteger} from "../utils/common.js";
import {POINT_TYPES} from "../const.js";
import dayjs from "dayjs";

const MIN_OFFERS_COUNT = 0;
const MAX_OFFERS_COUNT = 5;
const MIN_PRICE = 10;
const MAX_PRICE = 10000;
const MIN_PHOTOS_COUNT = 1;
const MAX_PHOTOS_COUNT = 6;
const OFFER_PRICES = [20, 30, 40, 50, 10];
let DESTINATIONS = [];
let OFFERS = [];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const DESTINATION_NAMES = [
  `Helsinki`,
  `Geneva`,
  `Berlin`,
  `Hamburg`,
  `Paris`,
  `London`,
  `Lisboa`,
  `Madrid`,
  `Palermo`,
  `Catania`
];

const generateDestinations = () => {
  let destinations = [];
  DESTINATION_NAMES.forEach((name) => {
    destinations.push({
      name,
      description: getRandomArrayElement(DESCRIPTIONS),
      photos: generatePhotos(getRandomInteger(MIN_PHOTOS_COUNT, MAX_PHOTOS_COUNT))
    });
  });
  return destinations;
};

const generateMockOffers = () => {
  let offers = [];
  POINT_TYPES.forEach((pointType) => {
    const offersCount = getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT);
    for (let i = 0; i < offersCount; i++) {
      offers.push({
        id: `${pointType.toLowerCase()}-offer-${i}`,
        type: pointType,
        title: `${pointType} offer ${i}`,
        price: OFFER_PRICES[getRandomInteger(0, OFFER_PRICES.length - 1)]
      });
    }
  });
  return offers;
};

const getRandomArrayElement = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};

const generatePhotos = (count) => {
  const photos = [];
  let photoPath = ``;
  for (let i = 0; i < count; i++) {
    photoPath = `http://picsum.photos/248/152?r=${Math.random()}`;
    photos.push(photoPath);
  }
  return photos;
};

const getRandomDate = () => {
  const minYear = 2020;
  const maxYear = 2025;
  const year = getRandomInteger(minYear, maxYear);
  const month = getRandomInteger(0, 11);
  const day = getRandomInteger(1, 28);
  const hour = getRandomInteger(0, 23);
  const minute = getRandomInteger(0, 59);
  const date = new Date(year, month, day, hour, minute);
  return dayjs(date);
};

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generatePoint = () => {
  const startTime = getRandomDate();
  let endTime = startTime.add(getRandomInteger(0, 24), `hour`);
  endTime = endTime.add(getRandomInteger(0, 59), `minute`);
  endTime = endTime.add(getRandomInteger(0, 59), `second`);
  const pointType = getRandomArrayElement(POINT_TYPES);
  const availableOffers = OFFERS.filter((o) => o.type === pointType);
  let selectedOffers = [];
  availableOffers.forEach((offer) => {
    const isSelected = Boolean(getRandomInteger(0, 1));
    if (isSelected) {
      selectedOffers.push(offer);
    }
  });
  return {
    id: generateId(),
    type: pointType,
    destination: getRandomArrayElement(DESTINATIONS),
    offers: selectedOffers,
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    startTime,
    endTime,
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

DESTINATIONS = generateDestinations();
OFFERS = generateMockOffers();

export {generatePoint, DESTINATIONS, OFFERS, generateId};
