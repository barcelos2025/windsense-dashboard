
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This component displays API documentation for the mock sensor API
const MockAPI: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API de Sensores</CardTitle>
        <CardDescription>
          Documentação da API para consumo dos dados de sensores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="endpoints">
          <TabsList className="mb-4">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="models">Modelos</TabsTrigger>
            <TabsTrigger value="auth">Autenticação</TabsTrigger>
          </TabsList>
          
          <TabsContent value="endpoints" className="space-y-4">
            <div className="rounded-md bg-secondary p-4">
              <h3 className="text-lg font-medium mb-2">GET /api/sensors</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Retorna todos os sensores e seus dados atuais.
              </p>
              <div className="text-sm bg-card p-2 rounded overflow-auto">
                <pre>
                  {`fetch('https://api.example.com/api/sensors')
  .then(response => response.json())
  .then(data => console.log(data));`}
                </pre>
              </div>
            </div>
            
            <div className="rounded-md bg-secondary p-4">
              <h3 className="text-lg font-medium mb-2">GET /api/sensors/:id</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Retorna dados detalhados de um sensor específico.
              </p>
              <div className="text-sm bg-card p-2 rounded overflow-auto">
                <pre>
                  {`fetch('https://api.example.com/api/sensors/sensor-01')
  .then(response => response.json())
  .then(data => console.log(data));`}
                </pre>
              </div>
            </div>
            
            <div className="rounded-md bg-secondary p-4">
              <h3 className="text-lg font-medium mb-2">GET /api/sensors/history/:id</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Retorna histórico de leituras de um sensor específico.
              </p>
              <div className="text-sm bg-card p-2 rounded overflow-auto">
                <pre>
                  {`fetch('https://api.example.com/api/sensors/history/sensor-01?days=7')
  .then(response => response.json())
  .then(data => console.log(data));`}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="space-y-4">
            <div className="rounded-md bg-secondary p-4">
              <h3 className="text-lg font-medium mb-2">Modelo de Sensor</h3>
              <div className="text-sm bg-card p-2 rounded overflow-auto">
                <pre>
                  {`{
  "id": "sensor-01",
  "name": "Sensor Centro",
  "location": {
    "lat": -21.5297,
    "lng": -42.6425,
    "description": "Centro de Leopoldina"
  },
  "readings": {
    "temperature": 27.5,
    "humidity": 65,
    "pressure": 1012,
    "windDirection": 45,
    "windSpeed": 8,
    "lastUpdated": "2023-06-10T15:30:00Z"
  }
}`}
                </pre>
              </div>
            </div>
            
            <div className="rounded-md bg-secondary p-4">
              <h3 className="text-lg font-medium mb-2">Modelo de Histórico</h3>
              <div className="text-sm bg-card p-2 rounded overflow-auto">
                <pre>
                  {`{
  "sensorId": "sensor-01",
  "sensorName": "Sensor Centro",
  "history": [
    {
      "timestamp": "2023-06-10T15:30:00Z",
      "temperature": 27.5,
      "humidity": 65,
      "pressure": 1012,
      "windDirection": 45,
      "windSpeed": 8
    },
    // Mais registros históricos...
  ]
}`}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="auth" className="space-y-4">
            <div className="rounded-md bg-secondary p-4">
              <h3 className="text-lg font-medium mb-2">Autenticação por API Key</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Todas as requisições devem incluir um cabeçalho de autenticação com uma API Key válida.
              </p>
              <div className="text-sm bg-card p-2 rounded overflow-auto">
                <pre>
                  {`fetch('https://api.example.com/api/sensors', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
                </pre>
              </div>
            </div>
            
            <div className="rounded-md bg-secondary p-4">
              <h3 className="text-lg font-medium mb-2">Obtenção de API Key</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Para obter uma API Key, entre em contato com o administrador do sistema.
              </p>
              <p className="text-sm text-muted-foreground">
                A API Key deve ser mantida em segredo e não deve ser compartilhada publicamente.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MockAPI;
