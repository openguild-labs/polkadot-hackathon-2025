import * as fs from 'fs';
import * as path from 'path';

// Adjust source and destination directories for relative paths
const sourceDir = path.join(__dirname, '../../out'); // Adjust relative path to Foundry's 'out' directory
const destDir = path.join(__dirname, './src/abi'); // Destination is within the 'fe' directory

// List of folders to copy ABIs from
const specifiedFolders = ['MockERC20.s.sol', 'PreMarketFactory.sol']; // Specify folders to copy

// Ensure destination folder exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Function to copy ABI files from specified folders
const copySpecifiedAbiFiles = (srcDir: string, destDir: string, folders: string[]): void => {
  folders.forEach(folder => {
    const folderPath = path.join(srcDir, folder);
    const destFolderPath = path.join(destDir, folder);

    // Ensure the destination folder exists
    if (!fs.existsSync(destFolderPath)) {
      console.log(`Destination folder not found: ${destFolderPath}. Creating folder.`);
      fs.mkdirSync(destFolderPath, { recursive: true });
    } else {
      console.log(`Destination folder already exists: ${destFolderPath}. Overwriting files.`);
    }

    // Copy files from source to destination
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const srcFile = path.join(folderPath, file);
          const destFile = path.join(destFolderPath, file);
          fs.copyFileSync(srcFile, destFile);
          console.log(`Copied: ${file} from ${folder}`);
        }
      });
    } else {
      console.log(`Source folder not found: ${folder}`);
    }
  });
};

// Run the function
copySpecifiedAbiFiles(sourceDir, destDir, specifiedFolders);
console.log('Specified ABI files copied successfully!');
