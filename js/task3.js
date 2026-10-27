const ticketTypes = [
  { id: "standard", name: "Стандарт", price: 5000, seatsLeft: 8 },
  { id: "vip", name: "VIP", price: 12000, seatsLeft: 3 },
  { id: "student", name: "Студенческий", price: 3000, seatsLeft: 5 }
];

const soldOutDates = ["2026-11-10", "2026-11-20"];
const validPromos = ["SALE20", "AITU20"];

const form = document.querySelector("#ticket-form");
form.noValidate = true;

const eventField = document.querySelector("#ticket-event");
const dateField = document.querySelector("#ticket-date");
const typeField = document.querySelector("#ticket-type");
const qtyField = document.querySelector("#ticket-qty");
const nameField = document.querySelector("#ticket-name");
const emailField = document.querySelector("#ticket-email");
const promoField = document.querySelector("#ticket-promo");

const fields = [eventField, dateField, typeField, qtyField, nameField, emailField, promoField];

const formSummary = document.querySelector("#form-summary");
const previewEvent = document.querySelector("#preview-event");
const previewDate = document.querySelector("#preview-date");
const previewType = document.querySelector("#preview-type-badge");
const previewSeats = document.querySelector("#preview-seats-left");
const previewName = document.querySelector("#preview-name");
const previewQty = document.querySelector("#preview-qty");
const previewTotal = document.querySelector("#preview-total");
const issuedList = document.querySelector("#issued-tickets-list");

function getSelectedType() {
  for (const item of ticketTypes) {
    if (item.id === typeField.value) {
      return item;
    }
  }
  return ticketTypes[0];
}

function checkField(field) {
  field.setCustomValidity("");
  let message = "";

  if (!field.checkValidity()) {
    message = "Пожалуйста, заполните это поле корректно.";
  }

  if (field === dateField && soldOutDates.includes(dateField.value)) {
    message = "На эту дату билеты распроданы (выберите другой день).";
    field.setCustomValidity(message);
  }

  if (field === qtyField && message === "") {
    const typeObj = getSelectedType();
    if (Number(qtyField.value) > typeObj.seatsLeft) {
      message = "Недостаточно мест! Осталось всего: " + typeObj.seatsLeft;
      field.setCustomValidity(message);
    }
  }

  if (field === nameField && message === "") {
    if (!nameField.value.trim().includes(" ")) {
      message = "Введите имя и фамилию через пробел.";
      field.setCustomValidity(message);
    }
  }

  if (field === promoField) {
    const code = promoField.value.trim().toUpperCase();
    if (code !== "" && !validPromos.includes(code)) {
      message = "Неверный промокод (доступны: SALE20, AITU20).";
      field.setCustomValidity(message);
    }
  }

  const errorBox = document.querySelector("#error-" + field.id);

  if (message !== "") {
    field.setAttribute("aria-invalid", "true");
    field.classList.add("input-error");
    field.classList.remove("input-valid");
    errorBox.textContent = message;
    return false;
  } else {
    field.setAttribute("aria-invalid", "false");
    field.classList.remove("input-error");
    field.classList.add("input-valid");
    errorBox.textContent = "";
    return true;
  }
}

function updatePreview() {
  const typeObj = getSelectedType();
  const qty = Number(qtyField.value) || 0;
  const code = promoField.value.trim().toUpperCase();

  previewEvent.textContent = eventField.value || "Мероприятие не выбрано";
  previewDate.textContent = dateField.value || "—";
  previewType.textContent = typeObj.name;
  previewSeats.textContent = "Осталось мест: " + typeObj.seatsLeft;
  previewName.textContent = nameField.value.trim() || "—";
  previewQty.textContent = qty + " шт.";

  let total = typeObj.price * qty;
  if (validPromos.includes(code)) {
    total = total * 0.8;
  }
  previewTotal.textContent = total + " ₸";
}

for (const field of fields) {
  field.addEventListener("blur", function () {
    field.dataset.touched = "yes";
    checkField(field);
  });

  field.addEventListener("input", function () {
    updatePreview();
    if (field.dataset.touched === "yes") {
      checkField(field);
    }
  });

  field.addEventListener("change", function () {
    updatePreview();
    if (field.dataset.touched === "yes") {
      checkField(field);
    }
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let errorsCount = 0;
  let firstBadField = null;

  for (const field of fields) {
    field.dataset.touched = "yes";
    const isOk = checkField(field);
    if (!isOk) {
      errorsCount = errorsCount + 1;
      if (firstBadField === null) {
        firstBadField = field;
      }
    }
  }

  if (errorsCount > 0) {
    formSummary.classList.remove("hidden", "status-win");
    formSummary.classList.add("status-loss");
    formSummary.textContent = "Найдено ошибок в форме: " + errorsCount + " шт.";
    firstBadField.focus();
    return;
  }

  const typeObj = getSelectedType();
  const qty = Number(qtyField.value);
  typeObj.seatsLeft = typeObj.seatsLeft - qty;

  const randomCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  const ticket = document.createElement("div");
  ticket.classList.add("issued-ticket-item");
  ticket.textContent =
    "Билет #AITU-" +
    randomCode +
    " | " +
    eventField.value +
    " (" +
    dateField.value +
    ") | " +
    typeObj.name +
    " x" +
    qty +
    " | Покупатель: " +
    nameField.value.trim();

  issuedList.appendChild(ticket);

  formSummary.classList.remove("hidden", "status-loss");
  formSummary.classList.add("status-win");
  formSummary.textContent = "Билет успешно создан! Код брони: AITU-" + randomCode;

  form.reset();
  for (const field of fields) {
    field.dataset.touched = "";
    field.removeAttribute("aria-invalid");
    field.classList.remove("input-error", "input-valid");
  }
  updatePreview();
});

updatePreview();
