const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const nodeModules = path.join(repoRoot, "node_modules");
const npmExecPath = process.env.npm_execpath;

const installPackage = (pkgName, version) => {
  const args = npmExecPath
    ? [npmExecPath, "install", "--no-save", `${pkgName}@${version}`]
    : ["npm", "install", "--no-save", `${pkgName}@${version}`];

  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.status !== 0) {
    console.warn(
      `[postinstall] Failed to install ${pkgName}. Exit code: ${result.status}`,
    );
    process.exit(result.status ?? 1);
  }
};

const resolveVersion = (pkg, fallback) => {
  try {
    const loaded = require(`${pkg}/package.json`);
    if (typeof loaded.version === "string") return loaded.version;
  } catch {
    // ignore
  }
  return fallback;
};

// Ensure esbuild binary matches the current platform/arch.
(() => {
  const targets = {
    linux: { x64: "linux-x64", arm64: "linux-arm64" },
    darwin: { x64: "darwin-x64", arm64: "darwin-arm64" },
    win32: { x64: "win32-x64", arm64: "win32-arm64", ia32: "win32-ia32" },
  };

  const target = targets[process.platform]?.[process.arch];
  if (!target) {
    console.warn(
      `[postinstall] Skipping esbuild check for ${process.platform}/${process.arch}`,
    );
    return;
  }

  const pkgName = `@esbuild/${target}`;
  if (!fs.existsSync(path.join(nodeModules, pkgName))) {
    installPackage(pkgName, resolveVersion("esbuild", "0.25.11"));
  }
})();

// Ensure lightningcss native binary matches the current platform/arch/libc.
(() => {
  const libcFamily = (() => {
    try {
      // eslint-disable-next-line global-require
      const libc = require("detect-libc");
      const family = libc.familySync?.();
      return family === libc.MUSL ? "musl" : "gnu";
    } catch {
      return "gnu";
    }
  })();

  const resolveTarget = () => {
    if (process.platform === "linux") {
      if (process.arch === "x64") return `linux-x64-${libcFamily}`;
      if (process.arch === "arm64") return `linux-arm64-${libcFamily}`;
      if (process.arch === "arm") return "linux-arm-gnueabihf";
    }
    if (process.platform === "darwin") {
      if (process.arch === "arm64") return "darwin-arm64";
      if (process.arch === "x64") return "darwin-x64";
    }
    if (process.platform === "freebsd" && process.arch === "x64") {
      return "freebsd-x64";
    }
    if (process.platform === "android" && process.arch === "arm64") {
      return "android-arm64";
    }
    if (process.platform === "win32") {
      if (process.arch === "x64") return "win32-x64-msvc";
      if (process.arch === "arm64") return "win32-arm64-msvc";
    }
    return null;
  };

  const target = resolveTarget();
  if (!target) {
    console.warn(
      `[postinstall] Skipping lightningcss check for ${process.platform}/${process.arch}`,
    );
    return;
  }

  const pkgName = `lightningcss-${target}`;
  if (!fs.existsSync(path.join(nodeModules, pkgName))) {
    installPackage(pkgName, resolveVersion("lightningcss", "1.30.2"));
  }
})();

// Run the original postinstall step for fumadocs-mdx.
const fumadocsBin = path.join(
  repoRoot,
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
