import TeamMemberForm from "../TeamMemberForm";
import { createTeamMember } from "../actions";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Nueva persona</h1>
      <TeamMemberForm action={createTeamMember} submitLabel="Guardar persona" />
    </div>
  );
}
