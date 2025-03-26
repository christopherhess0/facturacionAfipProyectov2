class WebSocketService {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000; // 3 segundos
    }

    connect() {
        try {
            console.log('Intentando conectar al WebSocket...');
            this.ws = new WebSocket('ws://localhost:3001/ws');

            this.ws.onopen = () => {
                console.log('Conexión WebSocket establecida');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Mensaje recibido:', data);
                    // Aquí puedes manejar los diferentes tipos de mensajes
                    if (data.type === 'connection') {
                        console.log('Conexión confirmada:', data.message);
                    }
                } catch (error) {
                    console.error('Error al procesar mensaje:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('Conexión WebSocket cerrada');
                this.reconnect();
            };

            this.ws.onerror = (error) => {
                console.error('Error en WebSocket:', error);
            };
        } catch (error) {
            console.error('Error al crear conexión WebSocket:', error);
            this.reconnect();
        }
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Intento de reconexión ${this.reconnectAttempts} de ${this.maxReconnectAttempts}`);
            setTimeout(() => this.connect(), this.reconnectDelay);
        } else {
            console.error('Se alcanzó el máximo número de intentos de reconexión');
        }
    }

    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket no está conectado');
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

const websocketService = new WebSocketService();
export default websocketService; 