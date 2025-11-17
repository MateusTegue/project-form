import FormTemplateBuilder from '../../components/templates/CreateFormTemplate';
import GetAllFormTemplatesCreated from '../../components/templates/GetAllFormTemplatesCreated';

export default function CreateFormtemplatePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Formularios</h1>
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <FormTemplateBuilder />
        </div>
        <div className="lg:w-1/2">
          <GetAllFormTemplatesCreated />
        </div>
      </div>
    </div>
  );
}