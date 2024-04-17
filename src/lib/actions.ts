"use server";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "./firebase";
import { validate_inputs } from "./utils";

export type AccountStateProp = {
  email: string;
  password: string;
  error: {
    text: string | undefined;
  };
  success: boolean;
};
export type AccountStateProps = {
  email: string;
  password: string;
  error: {
    text: string | undefined;
  };
  success: boolean;
};

export async function register(
  previousState: AccountStateProps,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const result = validate_inputs(email, password);
  const auth = getAuth(app);
  if (!result.error) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user: FirebaseUser = res.user;

      return {
        email: "",
        password: "",
        error: {
          text: undefined,
        },
        success: true,
      };
    } catch (error) {
      return {
        email,
        password,
        error: {
          text: result.error,
        },
        success: false,
      };
    }
  } else {
    return {
      email,
      password,
      error: {
        text: result.error,
      },
      success: false,
    };
  }
}

export async function login(
  previousState: AccountStateProp,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const result = validate_inputs(email, password);
  const auth = getAuth(app);
  if (!result.error) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user: FirebaseUser = userCredential.user;
      console.log(user, "sign in");
      return {
        email: "",
        password: "",
        error: { text: undefined },
        success: true,
      };
    } catch (error) {
      const { code, message } = error as { code: string; message: string };
      console.log(code, message);
      return { email, password, error: { text: message }, success: false };
    }
  } else {
    return {
      email,
      password,
      error: {
        text: result.error,
      },
      success: false,
    };
  }
}
