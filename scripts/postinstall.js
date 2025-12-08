const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const nodeModules = path.join(repoRoot, "node_modules");
const npmExecPath = process.env.npm_execpath;

const installPackage = (pkgName, version) => {
  console.log(`[postinstall] Installing missing binary "${pkgName}@${version}"`);

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
};

const resolveVersion = (pkg, fallback) => {
  try {
    const loaded = require(`${pkg}/package.json`);
    if (typeof loaded.version === "string") {
      return loaded.version;
    }
  } catch {
    // ignore
  }
  return fallback;
};

// Map the current platform/arch to the esbuild binary package name.
const esbuildTargets = {
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

const esbuildTarget = esbuildTargets[process.platform]?.[process.arch];
if (esbuildTarget) {
  const pkgName = `@esbuild/${esbuildTarget}`;
  const pkgPath = path.join(nodeModules, pkgName);

  if (!fs.existsSync(pkgPath)) {
    installPackage(pkgName, resolveVersion("esbuild", "0.25.11"));
  }
} else {
  console.warn(
    `[postinstall] Skipping esbuild binary check for ${process.platform}/${process.arch}`,
  );
}

// lightningcss also ships platform-specific binaries; ensure the right one is present.
const getLightningcssTarget = () => {
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

  if (process.platform === "linux") {
    if (process.arch === "x64") {
      return `linux-x64-${libcFamily}`;
    }
    if (process.arch === "arm64") {
      return `linux-arm64-${libcFamily}`;
    }
    if (process.arch === "arm") {
      return "linux-arm-gnueabihf";
    }
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

const lightningTarget = getLightningcssTarget();
if (lightningTarget) {
  const pkgName = `lightningcss-${lightningTarget}`;
  const pkgPath = path.join(nodeModules, pkgName);

  if (!fs.existsSync(pkgPath)) {
    installPackage(pkgName, resolveVersion("lightningcss", "1.30.2"));
  }
} else {
  console.warn(
    `[postinstall] Skipping lightningcss binary check for ${process.platform}/${process.arch}`,
  );
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
