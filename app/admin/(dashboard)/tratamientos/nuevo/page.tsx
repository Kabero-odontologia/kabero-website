import TreatmentForm from "../TreatmentForm";
import { createTreatment } from "../actions";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Nuevo tratamiento</h1>
      <TreatmentForm action={createTreatment} submitLabel="Guardar tratamiento" />
    </div>
  );
}
