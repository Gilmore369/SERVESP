/**
 * Script para reemplazar todas las referencias de apiClient por api
 * Ejecutar con: node fix-api-imports.js
 */

const fs = require('fs');
const path = require('path');

// Archivos que necesitan ser actualizados
const filesToUpdate = [
  'serves-platform/src/components/projects/KanbanBoard.tsx',
  'serves-platform/src/components/projects/ChecklistManager.tsx',
  'serves-platform/src/components/projects/ActivityForm.tsx',
  'serves-platform/src/components/projects/ActivityDetail.tsx',
  'serves-platform/src/components/projects/ProjectForm.tsx'
];

function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Reemplazar import
    if (content.includes("import { apiClient } from '@/lib/apiClient';")) {
      content = content.replace(
        "import { apiClient } from '@/lib/apiClient';",
        "import { api } from '@/lib/api';"
      );
      updated = true;
      console.log(`✅ Updated import in: ${filePath}`);
    }

    // Reemplazar todas las referencias apiClient. por api.
    const apiClientRegex = /apiClient\./g;
    if (apiClientRegex.test(content)) {
      content = content.replace(apiClientRegex, 'api.');
      updated = true;
      console.log(`✅ Updated apiClient references in: ${filePath}`);
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`💾 Saved: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing API imports...\n');

filesToUpdate.forEach(updateFile);

console.log('\n✅ API import fix completed!');
console.log('\n📝 Next steps:');
console.log('1. Restart your development server');
console.log('2. Test the projects page');
console.log('3. Check for any remaining errors in the console');