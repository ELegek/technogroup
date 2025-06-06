// Подключение функционала "Чертоги Фрилансера"
import { isMobile, getHash, menuClose } from "../functions.js";
import { flsModules } from "../../files/modules.js";
// Модуль прокрутки к блоку
import { gotoBlock } from "./gotoblock.js";
// Переменная контроля добавления события window scroll.
let addWindowScrollEvent = false;

//====================================================================================================================================================================================================================================================================================================
// Плавная навигация по странице
export function pageNavigation() {
  // data-goto - вказати ID блоку
  // data-goto-header - враховувати header
  // data-goto-top - недокрутити на вказаний розмір
  // data-goto-speed - швидкість (тільки якщо використовується додатковий плагін)
  // Работаем при нажатии на пункт
  document.addEventListener("click", pageNavigationAction);
  // Если подключен scrollWatcher, подсвечиваем текущий пункт меню
  document.addEventListener("watcherCallback", pageNavigationAction);
  // Основная функция
  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      if (targetElement.closest("[data-goto]")) {
        const gotoLink = targetElement.closest("[data-goto]");
        const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
        const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
        const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
        const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
        if (flsModules.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
          if (fullpageSectionId !== null) {
            flsModules.fullpage.switchingSection(fullpageSectionId);
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }
        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;
      // Обработка пунктов навигации, если указано значение navigator, подсвечивает текущий пункт меню
      if (targetElement.dataset.watch === "navigator") {
        const navigatorActiveItem = document.querySelector(`[data-goto]._navigator-active`);
        let navigatorCurrentItem;
        if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
          navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`);
        } else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index];
            if (document.querySelector(`[data-goto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
              break;
            }
          }
        }
        if (entry.isIntersecting) {
          // Видим объект
          // navigatorActiveItem ? navigatorActiveItem.classList.remove('_navigator-active') : null;
          navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null;
        } else {
          // Не видим объект
          navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
        }
      }
    }
  }
  // Прокрутки по хешу
  if (getHash()) {
    let goToHash;
    if (document.querySelector(`#${getHash()}`)) {
      goToHash = `#${getHash()}`;
    } else if (document.querySelector(`.${getHash()}`)) {
      goToHash = `.${getHash()}`;
    }
    goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
  }
}
// Работа с шапкой при скроле
export function headerScroll() {
  addWindowScrollEvent = true;
  const header = document.querySelector("header.header");
  const headerShow = header.hasAttribute("data-scroll-show");
  const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
  const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener("windowScroll", function (e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          // downscroll code
          header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
        } else {
          // upscroll code
          !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
        }
        timer = setTimeout(() => {
          !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
      if (headerShow) {
        header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
}
// Модуль анимация цифрового счетчика
export function digitsCounter() {
  // Обнуление
  if (document.querySelectorAll("[data-digits-counter]").length) {
    document.querySelectorAll("[data-digits-counter]").forEach((element) => {
      element.dataset.digitsCounter = element.innerHTML;
      element.innerHTML = `0`;
    });
  }

  // Функция инициализации
  function digitsCountersInit(digitsCountersItems) {
    let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
    if (digitsCounters.length) {
      digitsCounters.forEach((digitsCounter) => {
        digitsCountersAnimate(digitsCounter);
      });
    }
  }
  // Функция анимации
  function digitsCountersAnimate(digitsCounter) {
    let startTimestamp = null;
    const duration = parseInt(digitsCounter.dataset.digitsCounterSpeed)
      ? parseInt(digitsCounter.dataset.digitsCounterSpeed)
      : 1000;
    const startValue = parseInt(digitsCounter.dataset.digitsCounter);
    const startPosition = 0;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  function digitsCounterAction(e) {
    const entry = e.detail.entry;
    const targetElement = entry.target;
    if (targetElement.querySelectorAll("[data-digits-counter]").length) {
      digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
    }
  }

  document.addEventListener("watcherCallback", digitsCounterAction);
}
// При подключении модуля обработчик события запустится автоматически
setTimeout(() => {
  if (addWindowScrollEvent) {
    let windowScroll = new Event("windowScroll");
    window.addEventListener("scroll", function (e) {
      document.dispatchEvent(windowScroll);
    });
  }
}, 0);
