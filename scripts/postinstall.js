const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// Map the current platform/arch to the esbuild binary package name.
const targets = {
  linux: {
    x64: "linux-x64",
    arm64: "linux-arm64",
  },
  darwin: {
    x64: "darwin-x64",
    arm64: "darwin-arm64",
  },
  win32: {
    x64: "win32-x64",
    arm64: "win32-arm64",
    ia32: "win32-ia32",
  },
};

const target = targets[process.platform]?.[process.arch];

if (!target) {
  console.warn(
    `[postinstall] Skipping esbuild binary check for ${process.platform}/${process.arch}`,
  );
  process.exit(0);
}

const pkgName = `@esbuild/${target}`;
const pkgPath = path.join(__dirname, "..", "node_modules", pkgName);

// Install the platform-specific esbuild binary when it's missing (e.g., cached node_modules from another OS).
if (!fs.existsSync(pkgPath)) {
  let version = "0.25.11";

  try {
    const esbuildPkg = require("esbuild/package.json");
    if (typeof esbuildPkg.version === "string") {
      version = esbuildPkg.version;
    }
  } catch {
    // Use the default version from the lockfile if esbuild isn't resolvable yet.
  }

  const npmExecPath = process.env.npm_execpath;
  console.log(
    `[postinstall] Installing missing esbuild binary "${pkgName}@${version}"`,
  );

  let installResult;
  if (npmExecPath) {
    installResult = spawnSync(
      process.execPath,
      [npmExecPath, "install", "--no-save", `${pkgName}@${version}`],
      { stdio: "inherit" },
    );
  } else {
    installResult = spawnSync(
      "npm",
      ["install", "--no-save", `${pkgName}@${version}`],
      { stdio: "inherit" },
    );
  }

  if (installResult.status !== 0) {
    console.warn(
      `[postinstall] Failed to install ${pkgName}. Exit code: ${installResult.status}`,
    );
    process.exit(installResult.status ?? 1);
  }
}

// Run the original postinstall step for fumadocs-mdx.
const fumadocsBin = path.join(
  __dirname,
  "..",
  "node_modules",
  "fumadocs-mdx",
  "dist",
  "bin.js",
);
const fumadocsResult = spawnSync(process.execPath, [fumadocsBin], {
  stdio: "inherit",
});

if (fumadocsResult.status !== 0) {
  process.exit(fumadocsResult.status ?? 1);
}
