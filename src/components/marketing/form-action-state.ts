export type MarketingFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const INITIAL_MARKETING_FORM_STATE: MarketingFormState = {
  status: "idle",
  message: "",
};
