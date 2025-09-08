import { supabase } from "../SupabaseClient";

export const signUpUser = async (name, email, password) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.log("Signup error:", error.message);
      return { error: error.message };
    }
  } catch (error) {
    console.log("Unexpected Error:", error);
    return { error: "Something went wrong" };
  }

  return { error: null };
};

export default signUpUser;

