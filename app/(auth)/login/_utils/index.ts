import { SignUpFormData, SignInFormData } from "@/lib/types/login";
import { z } from "zod";

export function getFieldErrors(
  field: keyof SignUpFormData | keyof SignInFormData,
  errors?: z.core.$ZodIssue[],
) {
  return errors?.filter((error) => error.path.includes(field));
}
