import FAQForm from "../FAQForm";
import { createFAQ } from "../actions";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Nueva pregunta</h1>
      <FAQForm action={createFAQ} submitLabel="Guardar pregunta" />
    </div>
  );
}
