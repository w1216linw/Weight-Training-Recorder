import { Dispatch, SetStateAction } from "react";

export const validate_inputs = (email: string, password: string) => {
  if (email.length < 10) {
    throw new Error("Invalid email");
  }
  if (password.length < 6) {
    throw new Error("password is too short");
  }
  return;
};

export const handleError = (
  e: any,
  setError: Dispatch<SetStateAction<string>>
) => {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("An unknown error occurred.");
  }
};

export const getDate = () => {
  const currentDate = new Date();
  const formattedTime = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
  return formattedTime;
};
