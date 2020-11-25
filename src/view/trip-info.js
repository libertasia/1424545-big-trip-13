import dayjs from "dayjs";

const createTripInfoTemplate = (points) => {
  let title = ``;
  let dates = ``;
  let cost = 0;

  if (points.length <= 3) {
    points.forEach((element) => {
      title += `${element.destination} &mdash; `;
    });
    title = title.replace(new RegExp(`&mdash; ` + `$`), ``);
  } else {
    title = `${points[0].destination} &mdash; &hellip; &mdash; ${points[points.length - 1].destination}`;
  }

  dates = `${dayjs(points[0].startTime).format(`MMM D`)}&nbsp;&mdash;&nbsp;${dayjs(points[points.length - 1].endTime).format(`MMM D`)}`;

  points.forEach((element) => {
    cost += element.price;
    element.offers.forEach((offer) => {
      cost += offer.price;
    });
  });

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>
  `;
};

export {createTripInfoTemplate};
