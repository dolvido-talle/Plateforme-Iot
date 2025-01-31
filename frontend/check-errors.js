const { execSync } = require("child_process");
/* configuration du fichier de prem commit */
try {
  console.log("🔍 Exécution de lint-staged pour vérifier les fichiers...");
  execSync("npx lint-staged", { stdio: "inherit" });

  console.log(
    "\n\x1b[32m%s\x1b[0m",
    "✅ Félicitations ! Vous n'avez aucune erreur."
  );
  console.log(" ");
} catch (error) {
  console.log(
    "\n\x1b[31m%s\x1b[0m",
    "🚨 Vous avez des erreurs, veuillez les corriger avant de faire un commit !"
  );

  console.log("Détails de l'erreur :");
  console.error(error.stderr ? error.stderr.toString() : error.message);

  process.exit(1); // Bloque le commit
}
