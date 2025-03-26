// Тестове завдання передбачає створення сторінки з текстовим полем та кнопкою,
//  де користувач вводить рядок, а потім відображає його під формою.

//  Реалізується можливість виділення окремих символів або групи літер
// (через клік із Ctrl або виділяючий прямокутник) зі зміною їхнього кольору.

// Виділені символи можна перетягувати в будь-яке місце рядка або по всьому документу.
// При переміщенні однієї літери на місце іншої вони міняються місцями,
// виключаючи накладання. Використання готових бібліотек заборонено — лише чистий JavaScript і CSS.

const input = document.querySelector(".input");
const button = document.querySelector(".btn");
const form = document.querySelector(".form");

button.disabled = true;

function listMaker() {
  input.addEventListener("input", () => {
    button.disabled = !input.value.trim();
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const div = document.createElement("div");
    div.classList.add("line");
    form.appendChild(div);

    text.split("").forEach((letter, index) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.classList.add("letter");
      span.draggable = true;
      span.id = `drag-item-${index}`;
      div.appendChild(span);
    });

    input.value = "";
    button.disabled = true;

    highlighter();
    selectRectangle();
    drag();
  });
}

function toggleHighlight(letter) {
  letter.classList.toggle("highlighted");
}

function highlighter() {
  document.querySelectorAll(".letter").forEach((letter) => {
    letter.removeEventListener("click", handleLetterClick);
    letter.addEventListener("click", handleLetterClick);
  });
}

function handleLetterClick(event) {
  if (event.ctrlKey) {
    toggleHighlight(event.target);
  }
}

function selectRectangle() {
  let startX = 0,
    startY = 0,
    isDragging = false,
    selectionBox = null;

  document.addEventListener("mousedown", (event) => {
    if (!event.ctrlKey || event.target.classList.contains("letter")) return;

    startX = event.clientX;
    startY = event.clientY;
    isDragging = true;

    selectionBox = document.createElement("div");
    selectionBox.classList.add("selection-box");
    document.body.appendChild(selectionBox);

    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging || !selectionBox) return;

    selectionBox.style.width = `${Math.abs(event.clientX - startX)}px`;
    selectionBox.style.height = `${Math.abs(event.clientY - startY)}px`;
    selectionBox.style.left = `${Math.min(startX, event.clientX)}px`;
    selectionBox.style.top = `${Math.min(startY, event.clientY)}px`;
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    const letters = document.querySelectorAll(".letter");
    const selectRect = selectionBox.getBoundingClientRect();

    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      if (
        rect.left < selectRect.right &&
        rect.right > selectRect.left &&
        rect.top < selectRect.bottom &&
        rect.bottom > selectRect.top
      ) {
        toggleHighlight(letter);
      }
    });

    selectionBox.remove();
    isDragging = false;
  });
}

function drag() {
  let draggedElement = null;
  let offsetX = 0,
    offsetY = 0;

  document.querySelectorAll(".letter").forEach((letter) => {
    letter.addEventListener("dragstart", (event) => {
      draggedElement = event.target;
      offsetX = event.clientX - draggedElement.getBoundingClientRect().left;
      offsetY = event.clientY - draggedElement.getBoundingClientRect().top;
      draggedElement.style.opacity = "0.7";
    });

    document.querySelectorAll(".letter").forEach((targetLetter) => {
      targetLetter.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      targetLetter.addEventListener("drop", (event) => {
        event.preventDefault();
        if (draggedElement && draggedElement !== targetLetter) {
          const tempText = draggedElement.textContent;
          draggedElement.textContent = targetLetter.textContent;
          targetLetter.textContent = tempText;
          draggedElement.style.opacity = "1";
        }
      });
    });

    document.body.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    document.body.addEventListener("drop", (event) => {
      event.preventDefault();
      if (draggedElement) {
        draggedElement.style.position = "absolute";
        draggedElement.style.left = `${event.clientX - offsetX}px`;
        draggedElement.style.top = `${event.clientY - offsetY}px`;
        draggedElement.style.zIndex = "1000";
        draggedElement.style.opacity = "1";
        draggedElement = null;
      }
    });

    letter.addEventListener("dragend", () => {
      if (draggedElement) {
        draggedElement.style.opacity = "1";
        draggedElement = null;
      }
    });
  });
}

listMaker();
