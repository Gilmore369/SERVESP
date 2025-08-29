/**
 * VERSIÓN DE PRUEBA SIMPLE - Reemplaza temporalmente handleGetDashboardStats
 * Copia esta función en tu Google Apps Script para probar que el redeploy funciona
 */
function handleGetDashboardStats(requestId) {
  const startTime = Date.now();
  
  try {
    logMessage("INFO", "TESTING VERSION 2.1 - Fetching dashboard statistics", requestId);
    
    // Get simple counts from sheets
    const projectsData = getOptimizedSheetData("Proyectos", { page: 1, limit: 1000 });
    const personnelData = getOptimizedSheetData("Colaboradores", { page: 1, limit: 1000 });
    const activitiesData = getOptimizedSheetData("Actividades", { page: 1, limit: 1000 });
    
    // Return actual counts to prove it's working
    const stats = {
      activeProjects: projectsData.data.length,      // Should be 1
      activePersonnel: personnelData.data.length,    // Should be 1  
      pendingTasks: activitiesData.data.length,      // Should be 0
      remainingBudget: 50000,                        // Fixed different value
      
      // Proof that redeploy worked
      version: "v2.1-REDEPLOY-SUCCESS",
      timestamp: new Date().toISOString(),
      sheetsData: {
        projects: projectsData.data.length,
        personnel: personnelData.data.length,
        activities: activitiesData.data.length
      }
    };
    
    const duration = Date.now() - startTime;
    logMessage("INFO", "TESTING VERSION 2.1 - Stats calculated: " + JSON.stringify(stats), requestId);
    
    return createSuccessResponse(stats, requestId);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logMessage("ERROR", "TESTING VERSION 2.1 - Error: " + error.message, requestId);
    
    // Even the error should show different values
    const errorStats = {
      activeProjects: 999,
      activePersonnel: 999,
      pendingTasks: 999,
      remainingBudget: 999999,
      version: "v2.1-ERROR",
      error: error.message
    };
    
    return createSuccessResponse(errorStats, requestId);
  }
}

/**
 * INSTRUCCIONES:
 * 1. Copia SOLO la función handleGetDashboardStats de arriba
 * 2. Reemplaza la función existente en tu Google Apps Script
 * 3. Guarda (Ctrl+S)
 * 4. Despliega nueva versión
 * 5. Prueba con: curl "URL?action=getDashboardStats&token=demo-token-2024"
 * 
 * RESULTADO ESPERADO:
 * - activeProjects: 1 (en lugar de 8)
 * - activePersonnel: 1 (en lugar de 24)  
 * - pendingTasks: 0 (en lugar de 12)
 * - remainingBudget: 50000 (en lugar de 250000)
 * - version: "v2.1-REDEPLOY-SUCCESS"
 */