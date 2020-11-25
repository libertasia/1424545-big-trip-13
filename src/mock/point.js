import {getRandomInteger} from "../utils.js";
import {POINT_TYPES} from "../const.js";
import dayjs from "dayjs";

const MIN_OFFERS_COUNT = 0;
const MAX_OFFERS_COUNT = 5;
const MIN_PRICE = 10;
const MAX_PRICE = 10000;
const MIN_PHOTOS_COUNT = 1;
const MAX_PHOTOS_COUNT = 6;
// const OFFER_TITLES = [`Add luggage`, `Switch to comfort`, `Add meal`, `Choose seats`, `Travel by train`, `Rent a car`, `Order Uber`, `Add breakfast`];
const OFFER_PRICES = [20, 30, 40, 50, 10];
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
const DESTINATIONS = [
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

const generateMockOffers = () => {
  let offers = [];
  POINT_TYPES.forEach((pointType) => {
    const offersCount = getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT);
    for (let i = 0; i < offersCount; i++) {
      offers.push({
        type: pointType,
        title: `${pointType} offer ${i}`,
        price: OFFER_PRICES[getRandomInteger(0, OFFER_PRICES.length - 1)]
      });
    }
  });
  return offers;
};

// const isPropertyValueUsed = (propertyName, propertyValue, objArray) => {
//   for (let i = 0; i < objArray.length; i++) {
//     if (propertyValue === objArray[i][propertyName]) {
//       return true;
//     }
//   }
//   return false;
// };

const getRandomArrayElement = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};

// const generateOffers = (count, pointType) => {
//   const offers = [];
//   let title = ``;
//   let price = ``;
//   for (let i = 0; i < count; i++) {
//     do {
//       title = OFFER_TITLES[getRandomInteger(0, OFFER_TITLES.length - 1)];
//     }
//     while (isPropertyValueUsed(`title`, title, offers));

//     do {
//       price = OFFER_PRICES[getRandomInteger(0, OFFER_PRICES.length - 1)];
//     }
//     while (isPropertyValueUsed(`price`, price, offers));

//     offers.push({
//       type: pointType,
//       title,
//       price
//     });
//   }
//   return offers;
// };

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
  const minYear = 2019;
  const maxYear = 2021;
  const year = getRandomInteger(minYear, maxYear);
  const month = getRandomInteger(0, 11);
  const day = getRandomInteger(1, 28);
  const hour = getRandomInteger(0, 23);
  const minute = getRandomInteger(0, 59);
  const date = new Date(year, month, day, hour, minute);
  return dayjs(date);
};

const generatePoint = () => {
  const startTime = getRandomDate();
  let endTime = startTime.add(getRandomInteger(0, 24), `hour`);
  endTime = endTime.add(getRandomInteger(0, 59), `minute`);
  endTime = endTime.add(getRandomInteger(0, 59), `second`);
  const pointType = getRandomArrayElement(POINT_TYPES);
  return {
    type: pointType,
    destination: getRandomArrayElement(DESTINATIONS),
    //offers: generateOffers(getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT), pointType),
    offers: OFFERS.filter((o) => o.type === pointType),
    info: {
      description: getRandomArrayElement(DESCRIPTIONS),
      photo: generatePhotos(getRandomInteger(MIN_PHOTOS_COUNT, MAX_PHOTOS_COUNT))
    },
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    startTime,
    endTime,
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

OFFERS = generateMockOffers();

export {generatePoint, DESTINATIONS, OFFERS};
