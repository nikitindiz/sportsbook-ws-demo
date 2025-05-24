import { promises as fs } from "fs";
import path from "path";

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildServer() {
  try {
    // Copy server folder to dist
    await copyDir("./server", "./dist/bin");

    // Read the original package.json
    const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));

    // Create new package.json with selected fields
    const serverPackageJson = {
      name: packageJson.name,
      private: packageJson.private,
      version: packageJson.version,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
      scripts: {
        start: "node bin/www",
      },
    };

    // Write the new package.json to dist folder
    await fs.writeFile(
      "dist/package.json",
      JSON.stringify(serverPackageJson, null, 2),
      "utf8"
    );

    console.log("Server build completed successfully!");
  } catch (error) {
    console.error("Build server failed:", error);
    process.exit(1);
  }
}

buildServer();
