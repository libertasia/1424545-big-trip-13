import {FilterType} from "../const.js";
import {isDateInFuture, isDateInPast} from "./common";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isDateInFuture(point.startTime)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateInPast(point.endTIme))
};
