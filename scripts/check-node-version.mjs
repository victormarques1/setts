const [major, minor] = process.versions.node.split(".").map(Number);

const isSupported =
  major > 20 ||
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 12) ||
  major >= 24;

if (!isSupported) {
  console.error(
    `\nPrisma CLI requires Node.js 20.19+, 22.12+ or 24+.\n` +
      `Current: ${process.version}\n\n` +
      `If you use nvm: nvm use\n` +
      `Do not run Prisma via "sudo su" — root often uses an older Node.\n`,
  );
  process.exit(1);
}
