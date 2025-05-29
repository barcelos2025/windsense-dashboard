
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MapErrorProps {
  errorMessage: string;
}

const MapError: React.FC<MapErrorProps> = ({ errorMessage }) => {
  return (
    <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-border flex items-center justify-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro no Google Maps</AlertTitle>
        <AlertDescription>
          {errorMessage}<br />
          <p className="text-sm mt-2">
            Para corrigir este erro, verifique se:
            <ul className="list-disc pl-5 mt-1">
              <li>A chave da API Google Maps é válida</li>
              <li>Este domínio está autorizado na Console Google Cloud</li>
              <li>A API Maps JavaScript está ativada</li>
            </ul>
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MapError;
