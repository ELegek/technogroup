// Подключение функционала "Чертоги Фрилансера"
import { isMobile, FLS } from "./functions.js";
// Подключение списке активных модулей
import { flsModules } from "./modules.js";

// Подключение с node_modules
import tippy from "tippy.js";

// Подключение стилей src/scss/libs
import "../../scss/libs/tippy.scss";
// Подключение стилей из node_modules
//import 'tippy.js/dist/tippy.css';

// Запускаем и добавляем в объект модулей
flsModules.tippy = tippy("[data-tippy-content]", {});
