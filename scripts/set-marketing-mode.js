#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const mode = (process.argv[2] || "").toLowerCase()
const allowedModes = ["waitlist", "launch"]

if (!allowedModes.includes(mode)) {
  console.log("Usage: yarn marketing:mode <waitlist|launch>")
  console.log("Example: yarn marketing:mode waitlist")
  process.exit(1)
}

const repoRoot = path.resolve(__dirname, "..")
const envPath = path.join(repoRoot, "apps/web/.env")
const examplePath = path.join(repoRoot, "apps/web/.env.example")

const loadEnvLines = () => {
  if (fs.existsSync(envPath)) {
    return fs.readFileSync(envPath, "utf8").split(/\r?\n/)
  }
  if (fs.existsSync(examplePath)) {
    return fs.readFileSync(examplePath, "utf8").split(/\r?\n/)
  }
  return []
}

const lines = loadEnvLines()
let foundMode = false

const updatedLines = lines.map((line) => {
  if (/^\s*VITE_MODE\s*=/.test(line)) {
    foundMode = true
    return `VITE_MODE=${mode}`
  }
  return line
})

if (!foundMode) {
  if (updatedLines.length && updatedLines[updatedLines.length - 1].trim() !== "") {
    updatedLines.push("")
  }
  updatedLines.push("# Mode: waitlist or launch")
  updatedLines.push(`VITE_MODE=${mode}`)
}

const finalContent = updatedLines.join("\n").replace(/\n*$/, "\n")
fs.writeFileSync(envPath, finalContent)

console.log(`\n✅ Marketing page mode set to '${mode}'.`)
console.log(`   Updated ${path.relative(repoRoot, envPath)}`)
console.log("   Restart the Vite dev server if it was running.")
