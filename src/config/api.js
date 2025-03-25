const API_BASE_URL = 'http://localhost:3001';

export const API_URLS = {
    edificios: {
        list: `${API_BASE_URL}/api/edificios`,
        import: `${API_BASE_URL}/api/edificios/importar`,
    },
    trabajos: {
        list: `${API_BASE_URL}/api/trabajos`,
        create: `${API_BASE_URL}/api/trabajos`,
    }
};

export default API_URLS;

export const api = {
    // Trabajos
    getAllTrabajos: () => 
        fetch(`${API_BASE_URL}/api/trabajos`).then(res => res.json()),
    
    createTrabajo: (trabajo) => 
        fetch(`${API_BASE_URL}/api/trabajos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trabajo)
        }).then(res => res.json()),
    
    getTrabajosSinFacturar: (cuit) =>
        fetch(`${API_BASE_URL}/api/trabajos/no-facturados/${cuit}`).then(res => res.json()),
    
    facturarTrabajos: (datos) =>
        fetch(`${API_BASE_URL}/api/trabajos/facturar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        }).then(res => res.json()),

    // Exportación
    exportarAExcel: () => 
        fetch(`${API_BASE_URL}/api/exportar/to-excel`)
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'trabajos.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }),

    exportarAGoogleSheets: (fechaInicio, fechaFin) =>
        fetch(`${API_BASE_URL}/api/exportar/to-sheets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fechaInicio, fechaFin })
        }).then(res => res.json())
}; 