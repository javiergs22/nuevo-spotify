import { supabase } from "../SupabaseClient";

const loginUser = async (email, password) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login error:", error.message);
      return { error: error.message };
    }
  } catch (err) {
    console.log("Unexpected Error:", err);
    return { error: "Something went wrong" };
  }
};

export default loginUser;

