// Функция показывает сообщение об ошибке
const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

// Функция скрывает сообщение об ошибке
const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
};

// Функция проверяет валидность поля
const checkInputValidity = (formElement, inputElement, settings) => {
  // Проверка на кастомное сообщение для полей имени
  if (inputElement.hasAttribute('data-error-message')) {
    const regex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
    const value = inputElement.value;
    
    // Проверяем только если есть значение
    if (value && !regex.test(value)) {
      showInputError(
        formElement, 
        inputElement, 
        inputElement.dataset.errorMessage, 
        settings
      );
      return false;
    }
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement, 
      inputElement, 
      inputElement.validationMessage, 
      settings
    );
    return false;
  } else {
    hideInputError(formElement, inputElement, settings);
    return true;
  }
};

// Проверяет, есть ли невалидные поля в форме
const hasInvalidInput = (inputList) => {
  return inputList.some(inputElement => {
    return !inputElement.validity.valid;
  });
};

// Делает кнопку неактивной
const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

// Делает кнопку активной
const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
};

// Переключает состояние кнопки
const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

// Устанавливает обработчики событий для всех полей формы
const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// Включает валидацию всех форм
export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach(formElement => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    setEventListeners(formElement, settings);
  });
};

// Очищает ошибки валидации формы
export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement, settings);
  })
  
  disableSubmitButton(buttonElement, settings);
};
