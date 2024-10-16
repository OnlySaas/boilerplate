import fs from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import { TemplateName } from "../types";

export class TemplateService {
  private templatesDir: string;

  constructor() {
    // Use environment variable to set templates directory, with a fallback
    this.templatesDir = path.join(process.cwd(), "src", "templates");
    console.log(`Templates directory: ${this.templatesDir}`);
  }

  private async loadTemplate(templateName: string): Promise<string> {
    const templatePath = path.join("src", "templates", `${templateName}.hbs`); // Layer path
    console.log(`Attempting to load template: ${templatePath}`);
    try {
      const fileContent = await fs.readFile(templatePath, "utf-8");
      console.log(`Successfully loaded template: ${templateName}`);
      return fileContent;
    } catch (error: any) {
      console.error(`Error loading template ${templateName}:`, error);
      throw new Error(
        `Failed to load template: ${templateName}. Error: ${error.message}`
      );
    }
  }

  async renderTemplate(
    templateName: TemplateName,
    data: Record<string, any>
  ): Promise<string> {
    try {
      const baseTemplate = await this.loadTemplate("base");
      const contentTemplate = await this.loadTemplate(templateName);

      Handlebars.registerPartial("content", contentTemplate);
      const template = Handlebars.compile(baseTemplate);

      return template(data);
    } catch (error: any) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw new Error(
        `Failed to render template: ${templateName}. Error: ${error.message}`
      );
    }
  }
}
