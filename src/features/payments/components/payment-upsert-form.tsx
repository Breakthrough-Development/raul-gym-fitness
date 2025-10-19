"use client";
import { CurrencyInput } from "@/components/currency-input";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { SearchableSelect } from "@/components/search-select";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cliente, EstadoMembresia, Pago } from "@prisma/client";
import { useActionState } from "react";
import { upsertPayment } from "../actions/upsert-payment";
export type PaymentUpsertFormProps = {
  payment?: Pick<Pago, "id" | "monto" | "membresia" | "clienteId">;
  clients: Cliente[];
  onSuccess?: (actionState: unknown) => void;
};

export const PaymentUpsertForm = ({
  payment,
  clients,
  onSuccess,
}: PaymentUpsertFormProps) => {
  const [actionState, formAction] = useActionState(
    upsertPayment.bind(null, payment?.id),
    EMPTY_ACTION_STATE
  );

  const membershipStatus = Object.values(EstadoMembresia);

  const membershipDefaultValue = () => {
    if (actionState.payload?.get("membership") as string) {
      return actionState.payload?.get("membership") as string;
    }
    if (payment?.membresia) {
      return payment?.membresia;
    }
    return EstadoMembresia.MENSUAL;
  };

  return (
    <Form action={formAction} actionState={actionState} onSuccess={onSuccess}>
      <div className="flex gap-x-2 mb-1">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="clientId">Cliente</Label>
          <SearchableSelect
            defaultValue={
              (actionState.payload?.get("clientId") as string) ??
              payment?.clienteId
            }
            name="clientId"
            options={clients.map((client) => ({
              value: client.id,
              label: client.nombre + " " + client.apellido,
            }))}
            placeholder="Selecciona un cliente"
          />
          <FieldError actionState={actionState} name="clientId" />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="membership">Membresía</Label>
          <Select name="membership" defaultValue={membershipDefaultValue()}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una membresía" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Membresía</SelectLabel>
                {membershipStatus.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError actionState={actionState} name="membership" />
        </div>
      </div>
      <CurrencyInput
        actionState={actionState}
        name="monto"
        defaultValue={payment?.monto}
      />

      <SubmitButton label={payment ? "Editar" : "Crear"} />

      {actionState.message}
    </Form>
  );
};
