// src/utils/moduleStorage.js

const MODULE_KEY = "modules";

// Get all modules from local storage
export const getModules = () => {
  const savedModules = localStorage.getItem(MODULE_KEY);
  return savedModules ? JSON.parse(savedModules) : [];
};

// Save the entire module list to local storage
export const saveModules = (modules) => {
  localStorage.setItem(MODULE_KEY, JSON.stringify(modules));
};

// Add a new module to the list
export const addModule = (newModule) => {
  const modules = getModules();
  modules.push(newModule);
  saveModules(modules);
};

// Find a module by parentModuleCode and moduleName
export const findModule = (parentModuleCode, moduleName) => {
  const modules = getModules();
  return modules.find(
    (mod) =>
      mod.parentModuleCode === parentModuleCode &&
      mod.moduleName === moduleName
  );
};

// Initialize local storage with an empty array if not already set
export const initializeModules = () => {
  if (!localStorage.getItem(MODULE_KEY)) {
    saveModules([]);
  }
};