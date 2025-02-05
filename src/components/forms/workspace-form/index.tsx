import FormGenerator from "@/components/global/form-generator";
import useZodForm from "@/hooks/use-zod-form";
import { workspaceSchema } from "./schema";
import { useMutationData } from "@/hooks/use-mutation-data";
import { createWorkspace } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/loader";

const WorkspaceForm = () => {
  const { mutate, isPending } = useMutationData(
    ["create-workspace"],
    (workspace: { name: string }) => createWorkspace(workspace.name),
    "user-workspaces"
  );

  const { register, errors, onFormSubmit } = useZodForm(
    workspaceSchema,
    mutate
  );

  return (
    <form onSubmit={onFormSubmit} className="flex flex-col gap-y-3">
      <FormGenerator
        inputType="input"
        type="text"
        name="name"
        placeholder="Workspace Name"
        label="Name"
        register={register}
        errors={errors}
      />
      <Button
        type="submit"
        disabled={isPending}
        className="text-sm w-full mt-2"
      >
        <Loader state={isPending} color="#111111">
          Create Workspace
        </Loader>
      </Button>
    </form>
  );
};

export default WorkspaceForm;
