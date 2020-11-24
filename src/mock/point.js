import {getRandomInteger} from "../utils.js";
import {POINT_TYPES} from "../const.js";
import dayjs from "dayjs";

const MIN_OFFERS_COUNT = 0;
const MAX_OFFERS_COUNT = 5;
const MIN_PRICE = 10;
const MAX_PRICE = 10000;
const OFFER_TITLES = [`Add luggage`, `Switch to comfort`, `Add meal`, `Choose seats`, `Travel by train`, `Rent a car`, `Order Uber`, `Add breakfast`];
const OFFER_PRICES = [20, 30, 40, 50, 10];
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

const isPropertyValueUsed = (propertyName, propertyValue, objArray) => {
  for (let i = 0; i < objArray.length; i++) {
    if (propertyValue === objArray[i][propertyName]) {
      return true;
    }
  }
  return false;
};

const getRandomArrayElement = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};

const generateOffers = (count) => {
  const offers = [];
  let title = ``;
  let price = ``;
  for (let i = 0; i < count; i++) {
    do {
      title = OFFER_TITLES[getRandomInteger(0, OFFER_TITLES.length - 1)];
    }
    while (isPropertyValueUsed(`title`, title, offers));

    do {
      price = OFFER_PRICES[getRandomInteger(0, OFFER_PRICES.length - 1)];
    }
    while (isPropertyValueUsed(`price`, price, offers));

    offers.push({
      type: getRandomArrayElement(POINT_TYPES),
      title,
      price
    });
  }
  return offers;
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
  return {
    type: getRandomArrayElement(POINT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    offers: generateOffers(getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT)),
    info: {
      description: getRandomArrayElement(DESCRIPTIONS),
      photo: `http://picsum.photos/248/152?r=${Math.random()}`
    },
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    startTime,
    endTime,
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

export {generatePoint};
