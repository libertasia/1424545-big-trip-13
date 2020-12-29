import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createSiteMenuTemplate = () => {
  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active data-menu-item="${MenuItem.TABLE}" href="#">Table</a>
      <a class="trip-tabs__btn data-menu-item="${MenuItem.STATS}" href="#">Stats</a>
    </nav>
  `;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    if (item !== null) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}

