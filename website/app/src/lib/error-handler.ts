import { AxiosError } from "axios";
import { toast } from "sonner";

export function handleError(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
  } else if (error instanceof Error) {
    toast.error(error.message, {
      richColors: true,
    });
  } else {
    toast.error("An unexpected error occurred");
  }
  console.error("Error:", error);
}
