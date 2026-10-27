const MAX_IN_PROGRESS = 3;

const tasks = [
  { id: 1, title: "Создать структуру HTML", tag: "HTML", priority: 3, urgent: true, status: "done" },
  { id: 2, title: "Подключить файл стилей CSS", tag: "CSS", priority: 2, urgent: false, status: "done" },
  { id: 3, title: "Сделать шапку сайта", tag: "HTML", priority: 2, urgent: false, status: "done" },
  { id: 4, title: "Написать игру Больше/Меньше", tag: "JS", priority: 3, urgent: true, status: "progress" },
  { id: 5, title: "Сделать Канбан-доску", tag: "JS", priority: 3, urgent: true, status: "progress" },
  { id: 6, title: "Настроить цвета кнопок", tag: "CSS", priority: 1, urgent: false, status: "todo" },
  { id: 7, title: "Добавить живую проверку формы", tag: "JS", priority: 3, urgent: true, status: "todo" },
  { id: 8, title: "Адаптировать под телефон 375px", tag: "CSS", priority: 2, urgent: false, status: "todo" },
  { id: 9, title: "Проверить работу без ошибок", tag: "Тесты", priority: 2, urgent: false, status: "todo" },
  { id: 10, title: "Загрузить проект на GitHub", tag: "HTML", priority: 1, urgent: false, status: "todo" }
];

const board = document.querySelector("#kanban-board");
const colTodo = document.querySelector("#col-todo");
const colProgress = document.querySelector("#col-progress");
const colDone = document.querySelector("#col-done");

const progressText = document.querySelector("#kanban-progress-text");
const progressBar = document.querySelector("#kanban-progress-bar");
const kanbanMessage = document.querySelector("#kanban-message");
const emptyMessage = document.querySelector("#kanban-empty");

const tagFilter = document.querySelector("#kanban-tag-filter");
const sortSelect = document.querySelector("#kanban-sort");

function setKanbanNotice(text, statusClass) {
  kanbanMessage.textContent = text;
  kanbanMessage.classList.remove("status-neutral", "status-win", "status-loss");
  kanbanMessage.classList.add(statusClass);
}

function render() {
  colTodo.textContent = "";
  colProgress.textContent = "";
  colDone.textContent = "";

  let doneCount = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "done") {
      doneCount = doneCount + 1;
    }
  }

  const percent = Math.round((doneCount / tasks.length) * 100);
  progressText.textContent = doneCount + " из " + tasks.length + " (" + percent + "%)";
  progressBar.value = percent;

  const selectedTag = tagFilter.value;
  const visibleTasks = [];

  for (const task of tasks) {
    if (selectedTag === "all" || task.tag === selectedTag) {
      visibleTasks.push(task);
    }
  }

  if (sortSelect.value === "desc") {
    visibleTasks.sort(function (a, b) {
      return b.priority - a.priority;
    });
  } else if (sortSelect.value === "asc") {
    visibleTasks.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }

  if (visibleTasks.length === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
  }

  for (const task of visibleTasks) {
    const card = document.createElement("div");
    card.classList.add("kanban-card");
    if (task.urgent === true) {
      card.classList.add("card-urgent");
    }

    const title = document.createElement("p");
    title.classList.add("card-title");
    title.textContent = task.title;

    const info = document.createElement("p");
    info.classList.add("card-meta");
    info.textContent = "Тег: " + task.tag + " | Приоритет: " + task.priority;

    const actions = document.createElement("div");
    actions.classList.add("card-actions");

    if (task.status !== "todo") {
      const btnPrev = document.createElement("button");
      btnPrev.type = "button";
      btnPrev.classList.add("btn", "btn-outline", "btn-small");
      btnPrev.textContent = "← Назад";
      btnPrev.dataset.id = task.id;
      btnPrev.dataset.move = "left";
      actions.appendChild(btnPrev);
    }

    if (task.status !== "done") {
      const btnNext = document.createElement("button");
      btnNext.type = "button";
      btnNext.classList.add("btn", "btn-primary", "btn-small");
      btnNext.textContent = "Дальше →";
      btnNext.dataset.id = task.id;
      btnNext.dataset.move = "right";
      actions.appendChild(btnNext);
    }

    card.appendChild(title);
    card.appendChild(info);
    card.appendChild(actions);

    if (task.status === "todo") {
      colTodo.appendChild(card);
    } else if (task.status === "progress") {
      colProgress.appendChild(card);
    } else {
      colDone.appendChild(card);
    }
  }
}

board.addEventListener("click", function (event) {
  const move = event.target.dataset.move;
  const id = Number(event.target.dataset.id);

  if (!move || !id) {
    return;
  }

  let inProgressCount = 0;
  for (const item of tasks) {
    if (item.status === "progress") {
      inProgressCount = inProgressCount + 1;
    }
  }

  for (const task of tasks) {
    if (task.id === id) {
      const goingToProgress =
        (task.status === "todo" && move === "right") ||
        (task.status === "done" && move === "left");

      if (goingToProgress && inProgressCount >= MAX_IN_PROGRESS) {
        setKanbanNotice("Заблокировано: в колонке «В работе» может быть максимум 3 карточки!", "status-loss");
        return;
      }

      if (move === "right") {
        task.status = task.status === "todo" ? "progress" : "done";
      } else {
        task.status = task.status === "done" ? "progress" : "todo";
      }

      setKanbanNotice("Статус задачи «" + task.title + "» обновлён.", "status-win");
      break;
    }
  }

  render();
});

tagFilter.addEventListener("change", render);
sortSelect.addEventListener("change", render);

render();
