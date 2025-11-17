interface SkeletonProps {
  message?: string;
}

export default function CompanySkeleton({ message = "Cargando..." }: SkeletonProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
