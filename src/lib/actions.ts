"use server";

export type AccountStateProp = {
  email: string;
  password: string;
  errors: {
    text: string | undefined;
  };
};

export async function register(
  previousState: AccountStateProp,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
}
