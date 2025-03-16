import Dexie, { Table } from "dexie";
import { message } from "antd";
export interface MineType {
  id?: number;
  type: string;
  description?: string;
}

export interface Module {
  id?: number;
  details: {
    name: string;
    description?: string;
  };
}

export interface Library {
  id?: number;
  title: string;
  content?: string;
}

export class DataStorage extends Dexie {
  mineTypes!: Table<MineType, number>;
  modules!: Table<Module, number>;
  projects!: Table<any, number>;
  moduleLibrary!: Table<Library, number>;

  constructor() {
    super("MTDS");
    this.version(1).stores({
      mineTypes: "++id, type",
      modules: "details.name",
      projects: "name",
      moduleLibrary: "title",
    });
    this.mineTypes = this.table("mineTypes");
    this.modules = this.table("modules");
    this.projects = this.table("projects");
    this.moduleLibrary = this.table("moduleLibrary");
  }

  async addModule(module: Module): Promise<number> {
    return this.modules.add(module);
  }

  async getModules(): Promise<any> {
    return this.modules.toArray();
  }

  async saveModules(modules: Module[]): Promise<void> {
    await this.modules.clear();
    await this.modules.bulkAdd(modules);
  }

  async deleteModule(id: number): Promise<void> {
    await this.modules.delete(id);
  }

  async addMineType(mineType: MineType): Promise<number> {
    return this.mineTypes.add(mineType);
  }

  async getAllMineTypes(): Promise<MineType[]> {
    return this.mineTypes.toArray();
  }

  async addProject(project: any): Promise<number> {
    return this.projects.add(project);
  }

  async getProjects(): Promise<any[]> {
    return this.projects.toArray();
  }

  async deleteProject(id: number): Promise<void> {
    await this.projects.delete(id);
  }

  async addLibrary(library: any): Promise<number> {
    return this.moduleLibrary.add(library);
  }

  async getAllLibraries(): Promise<any> {
    return this.moduleLibrary.toArray();
  }

  async updateLibrary(id: number, newRecord: any): Promise<void> {
    try {
      const existingLibrary = await this.moduleLibrary.get(id);
      if (existingLibrary) {
        const updatedLibrary = { ...newRecord, id };
        await this.moduleLibrary.put(updatedLibrary);
        message.success(`Library with ID ${id} updated successfully.`);
      } else {
        message.warning(`Library with ID ${id} not found.`);
      }
    } catch (error) {
      message.error("Error updating library in IndexedDB:");
    }
  }

  async deleteLibrary(id: number): Promise<void> {
    try {
      const existingLibrary = await this.moduleLibrary.get(id);
      if (existingLibrary) {
        await this.moduleLibrary.delete(id);
        message.success(`Library with ID ${id} deleted successfully.`);
      } else {
        message.warning(`Library with ID ${id} not found.`);
      }
    } catch (error) {
      message.error("Error deleting library from IndexedDB:");
    }
  }

}

export const db = new DataStorage();
