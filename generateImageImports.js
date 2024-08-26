import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const characterDir = path.join(__dirname, "public", "characters");
const characterFolders = fs
  .readdirSync(characterDir)
  .filter((folder) => !folder.startsWith("."));

// Initialize output strings for imports and exports
let importStatements = "";
let exportStatements = "export const characterImages = {\n";

characterFolders.forEach((folder) => {
  const folderPath = path.join(characterDir, folder);
  const folderName = folder.split(" - ")[1].replace(/\s+/g, "");

  const displayImages = [];
  const iconImages = [];

  fs.readdirSync(folderPath).forEach((file, index) => {
    if (file.includes("chara_1")) {
      const importName = `${folderName}Display${index + 1}`;
      importStatements += `import ${importName} from '../public/characters/${folder}/${file}';\n`;
      displayImages.push(importName);
    } else if (file.includes("chara_2")) {
      const importName = `${folderName}Icon${index + 1}`;
      importStatements += `import ${importName} from '../public/characters/${folder}/${file}';\n`;
      iconImages.push(importName);
    }
  });

  // Add the character's images to the export statement
  exportStatements += `  '${folderName}': {\n`;
  exportStatements += `    displayImages: [${displayImages.join(", ")}],\n`;
  exportStatements += `    iconImages: [${iconImages.join(", ")}],\n`;
  exportStatements += `  },\n`;
});

exportStatements += "};\n";

// Combine imports and exports into one output
const output = `${importStatements}\n${exportStatements}`;
fs.writeFileSync(
  path.join(__dirname, "./src/utils/characterImages.js"),
  output
);
console.log("Image import file generated successfully.");
