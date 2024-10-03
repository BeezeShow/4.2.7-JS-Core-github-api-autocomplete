const BASE_URL = "https://api.github.com";
const formEl = document.querySelector("form");
const inputEl = document.querySelector("input");
const listEl = document.querySelector(".list");
const formListEl = document.querySelector(".form-list");

const listItemTemplate = document
  .querySelector(".list-item-template")
  .content.querySelector(".list-item");

const addFormListItem = (formList, listItem) => {
  const newFormListItem = document.createElement("button");
  newFormListItem.classList.add("form-list-item");
  newFormListItem.textContent = listItem.name;
  newFormListItem.addEventListener("click", () => {
    addListItem(listItem);
    clearFormList(formListEl);
    formEl.reset();
  });
  formList.append(newFormListItem);
};

const clearFormList = (formList) => {
  formList.textContent = "";
};

const addListItem = ({ name, owner, forks }) => {
  const newListItem = listItemTemplate.cloneNode(true);
  const newListItemNameEl = newListItem.querySelector(".list-item-name");
  const newListItemOwnerEl = newListItem.querySelector(".list-item-owner");
  const newListItemStarsEl = newListItem.querySelector(".list-item-stars");
  const newListItemDeleteBtnEl = newListItem.querySelector(".list-item-delete");
  newListItemNameEl.textContent = name;
  newListItemOwnerEl.textContent = owner.login;
  newListItemStarsEl.textContent = forks;
  newListItemDeleteBtnEl.addEventListener("click", () => newListItem.remove());
  listEl.append(newListItem);
};

const getRepsByQuery = async (query) => {
  const response = await fetch(BASE_URL + "/search/repositories?q=" + query);
  return await response.json();
};
const handleInput = async (e) => {
  const value = e.target.value;
  if (value.length <= 2) {
    clearFormList(formListEl)
    return
  }
  if (!value || value.length < 2) return;
  const { items } = await getRepsByQuery(value);
  clearFormList(formListEl);
  items.slice(0, 5).forEach((item) => {
    addFormListItem(formListEl, item);
  });
};
const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};
const debouncedHandleInput = debounce(handleInput, 500);
inputEl.addEventListener("input", debouncedHandleInput);
formEl.addEventListener("submit", (e) => e.preventDefault());
