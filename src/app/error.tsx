"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const isAuthError =
    error.message?.includes("role") ||
    error.message?.includes("user is null") ||
    error.message?.includes("authentication") ||
    error.message?.includes("authorization");

  const isNetworkError =
    error.message?.includes("network") ||
    error.message?.includes("fetch") ||
    error.message?.includes("connection");

  const handleAction = () => {
    if (isAuthError) {
      window.location.href = "/";
    } else {
      reset();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-2/4 p-4">
        <div className="mx-auto w-16 h-16 mb-4">
          {isAuthError ? (
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-9a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-3">
          {isAuthError
            ? "Acceso no autorizado"
            : isNetworkError
            ? "Error de conexión"
            : "Ha ocurrido un error"}
        </h1>

        <div className="text-gray-700 mb-6 space-y-2">
          {isAuthError ? (
            <>
              <p>
                No tienes permisos para acceder a esta página o tu sesión ha
                expirado.
              </p>
              <p className="text-sm text-gray-500">
                Por favor, inicia sesión nuevamente.
              </p>
            </>
          ) : isNetworkError ? (
            <>
              <p>Problema de conexión detectado.</p>
              <p className="text-sm text-gray-500">
                Verifica tu conexión a internet e intenta nuevamente.
              </p>
            </>
          ) : (
            <>
              <p>{error.message}</p>
              <p className="text-sm text-gray-500">
                Si el problema persiste, contacta al administrador.
              </p>
            </>
          )}
        </div>

        <div className="flex gap-2 justify-center items-center">
          <Button
            onClick={handleAction}
            className={`px-6 py-2 text-white rounded transition-colors ${
              isAuthError
                ? "bg-primary hover:bg-white hover:text-primary border border-primary"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isAuthError ? "Ir al inicio de sesión" : "Intentar nuevamente"}
          </Button>

          {isAuthError && (
            <Button
              onClick={reset}
              className=" px-6 py-2 text-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Volver a la página anterior
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
