// src/utils/moduleStorage.js

const MODULE_KEY = "modules";
const FORM_DATA = "formDatas";
const MINE_TYPE_KEY = "mineTypes";
const DOCUMENTS_KEY = " documents";

// Get all modules from local storage
// Flatten nested arrays from local storage
export const getModules = () => {
  const savedModules = localStorage.getItem(MODULE_KEY);
  const modules = savedModules ? JSON.parse(savedModules) : [];
  return flattenModules(modules);
};

const flattenModules = (modules: any) => {
  return modules.reduce((acc: any, item: any) => {
    if (Array.isArray(item)) {
      return acc.concat(flattenModules(item)); // Handle nested arrays
    }
    return acc.concat(item); // Handle single-level items
  }, []);
};


// Save the entire module list to local storage
export const saveModules = (modules: any) => {
  localStorage.setItem(MODULE_KEY, JSON.stringify(modules));
};

// Add a new module to the list
export const addModule = (newModule: any) => {
  const modules = getModules();
  modules.push(newModule);
  saveModules(modules);
};

export const updateModule = (newModule: any) => {
  console.log('New Module:', newModule);
  let modules = getModules();

  // Find the index of the module to be updated
  const moduleIndex = modules.findIndex(
    (mod: any) =>
      mod.parentModuleCode === newModule.parentModuleCode &&
      mod.moduleName === newModule.moduleName
  );

  if (moduleIndex !== -1) {
    // Update the existing module
    modules[moduleIndex] = {
      ...modules[moduleIndex],
      ...newModule, // Merge new properties into the existing module
    };
    console.log(`Updated module: ${newModule.moduleName}`);
  } else {
    // If not found, alert the user
    window.alert("Didn't find any module with this module name & code!");
  }

  // Save the updated modules back to local storage
  saveModules(modules);
};

export const findModule = (parentModuleCode: string, moduleName: string) => {
  const modules = getModules();
  return modules.find(
    (mod: any) =>
      mod.parentModuleCode === parentModuleCode &&
      mod.moduleName === moduleName
  );
};

// Check if a moduleName already exists in the module list
export const isDuplicateModuleName = (moduleName: string) => {
  const modules = getModules();
  return modules.some((mod: any) => mod.moduleName === moduleName);
};

// Check if a moduleCode already exists in the module list
export const isDuplicateModuleCode = (moduleCode: string) => {
  const modules = getModules();
  return modules.some((mod: any) => mod.parentModuleCode === moduleCode);
};

// Initialize local storage with an empty array if not already set
export const initializeModules = () => {
  if (!localStorage.getItem(MODULE_KEY)) {
    saveModules([]);
  }
};

/**
 * Get a sorted list of module names based on a predefined sequence.
 * @returns {Array<string>} - List of module names in the specified sequence.
 */
export const getOrderedModuleNames = () => {
  const savedModules = localStorage.getItem(MODULE_KEY);
  const modules = savedModules ? JSON.parse(savedModules) : [];

  // Predefined sequence of module names
  const moduleSequence = [
    "Explored",
    "GR Approved",
    "Mine Plan Approved",
    "Grant of TOR",
    "EC",
    "FC",
    "CTE",
    "CTO",
    "Mine Opening Permission",
  ];

  // Extract valid module names from savedModules
  const moduleNames = modules
    .map((module) => module?.moduleName) // Ensure `moduleName` exists
    .filter((name) => name); // Remove undefined or falsy values

  // Sort module names based on predefined sequence first
  const orderedModules = moduleSequence.filter((name) =>
    moduleNames.includes(name)
  );

  // Add remaining modules not in the predefined sequence, sorted alphabetically
  const otherModules = moduleNames
    .filter((name) => !moduleSequence.includes(name))
    .sort((a, b) => a.localeCompare(b));

  // Combine both lists
  return [...orderedModules, ...otherModules];
};




//Form data related code.....

export const saveFormDataToListInLocalStorage = (formData: any) => {
  const formDatas = loadFormDataListFromLocalStorage();

  // Dynamically set the project_id
  formData.project_id = getNewProjectId();

  // Add the new form data to the list
  formDatas.push(formData);

  // Save the updated list back to local storage
  localStorage.setItem(FORM_DATA, JSON.stringify(formDatas));
};



export const loadFormDataListFromLocalStorage = () => {
  const storedData = localStorage.getItem(FORM_DATA);
  if (storedData) {
    return JSON.parse(storedData); // Returns the list of form data
  }
  return [];
};


export const clearFormDataListInLocalStorage = () => {
  localStorage.removeItem(FORM_DATA);
};

export const isDuplicateProjectName = (projectName: string) => {
  const existingData = loadFormDataListFromLocalStorage();
  // Check for duplicate project name
  return existingData.some(
    (data: any) => data.projectName.toLowerCase() === projectName.toLowerCase()
  );
}

export const listOfProjectName = () => {
  const storedData = loadFormDataListFromLocalStorage();
  return storedData.map((data: any) => data.projectName);
};

export const getFormDataByProjectName = (projectName: string) => {
  const allFormData = loadFormDataListFromLocalStorage();
  return allFormData.find((data: any) => data.projectName === projectName) || null;
};

const getNewProjectId = () => {
  const allFormData = loadFormDataListFromLocalStorage();

  // Find the maximum project_id, defaulting to 0 if the list is empty
  const maxProjectId = allFormData.reduce((maxId: number, data: any) => {
    return data.project_id > maxId ? data.project_id : maxId;
  }, 0);

  return maxProjectId + 1;
};


//       Mine Type.....

export const getAllMineType = () => {
  const savedModules = localStorage.getItem(MINE_TYPE_KEY);

  // Check if savedModules is null or undefined
  if (savedModules === null || savedModules === 'undefined') {
    console.warn("mineTypes is not available or is 'undefined' in localStorage.");
    return []; // Return an empty array if no valid data exists
  }

  let modules = [];
  try {
    // Parse the saved data
    modules = JSON.parse(savedModules);
    if (!Array.isArray(modules)) {
      // Fallback if the data is not an array
      console.warn("Parsed mineTypes is not an array. Returning empty array.");
      modules = [];
    }
  } catch (error) {
    console.error("Error parsing mine types from localStorage:", error);
    modules = []; // Fallback to an empty array if parsing fails
  }

  return modules;
};


export const updateMineType = (mineTypes: any) => {
  // Check if mineTypes is undefined or null and set it to a default value (e.g., [])
  if (mineTypes === undefined || mineTypes === null) {
    console.warn("mineTypes is undefined or null. Setting to default empty array.");
    mineTypes = []; // Default to an empty array or any valid data structure
  }

  try {
    const serializedMineTypes = JSON.stringify(mineTypes);
    localStorage.setItem(MINE_TYPE_KEY, serializedMineTypes);
  } catch (error) {
    console.error("Error saving mine types to localStorage:", error);
  }
};



//    Documents ........


export const getAllDocuments = () => {
  const savedDocuments = localStorage.getItem(DOCUMENTS_KEY);
  if (savedDocuments === null || savedDocuments === "undefined") {
    console.warn("Documents are not available or are 'undefined' in localStorage.");
    return []; // Return an empty array if no valid data exists
  }
  return savedDocuments ? JSON.parse(savedDocuments) : [];
};

export const saveDocument = (document: any) => {
  if (!document || typeof document !== "object") {
    console.error("Invalid document object provided.");
    return false; 
  }

  const existingDocuments = getAllDocuments();
  existingDocuments.push(document);

  try {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(existingDocuments));
    return true; 
  } catch (error) {
    console.error("Error saving documents to localStorage:", error);
    return false; 
  }
};

export const updateDocument = (id: Number, document: any) => {
  if (!document || typeof document !== "object") {
    console.error("Invalid document object provided.");
    return false; 
  }

  const existingDocuments = getAllDocuments();
  existingDocuments.push(document);

  try {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(existingDocuments));
    return true; 
  } catch (error) {
    console.error("Error saving documents to localStorage:", error);
    return false; 
  }
};


// Delete a document from localStorage based on its index
export const deleteDocument = (index: number) => {
  const existingDocuments = getAllDocuments();
  
  if (index < 0 || index >= existingDocuments.length) {
    console.error("Invalid document index.");
    return false; // Return false if the index is out of bounds
  }

  // Remove the document from the array
  existingDocuments.splice(index, 1);

  try {
    // Save the updated documents list back to localStorage
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(existingDocuments));
    return true;
  } catch (error) {
    console.error("Error deleting document from localStorage:", error);
    return false; 
  }
};





