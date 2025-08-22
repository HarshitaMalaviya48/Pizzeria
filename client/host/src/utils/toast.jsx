import { toast } from "react-toastify";

export const showToast = (message, type = "info") => {
  switch (type) {
    case "success":
      console.log("in success message toast");

      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warn":
      toast.warn(message);
      break;
    case "info":
      toast.info(message);
      break;
    default:
      toast(message);
  }
};
