import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../libs/firebase";

// Types
interface UserState {
  isLoading: boolean;
  isAuth: boolean;
  error: string | null;
}

// Initial State
const initialState: UserState = {
  isLoading: false,
  isAuth: false,
  error: null,
};

// Thunks
export const register = createAsyncThunk(
  "user/register",
  async (
    {
      username,
      userEmail,
      pass,
    }: { userEmail: string; pass: string; username: string },
    { rejectWithValue },
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        pass,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      user
        .getIdToken()
        .then((token) => localStorage.setItem("userToken", token));

      return;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to register");
    }
  },
);

export const login = createAsyncThunk(
  "user/login",
  async (
    { userEmail, pass }: { userEmail: string; pass: string },
    { rejectWithValue },
  ) => {
    try {
      await signInWithEmailAndPassword(auth, userEmail, pass);

      return;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to login");
    }
  },
);

export const autoLogin = createAsyncThunk("user/autoLogin", async () => {
  return new Promise((resolve: any, reject: any): void => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        if (user) {
          user
            .getIdToken(true)
            .then(() => {
              resolve();
            })
            .catch(() => reject());
        } else {
          reject();
        }
      },
      () => reject(),
    );
  });
});

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = true;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to login";
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = true;
      })
      .addCase(register.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to register";
      })

      // Auto Login
      .addCase(autoLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(autoLogin.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = true;
      })
      .addCase(autoLogin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default userSlice.reducer;
