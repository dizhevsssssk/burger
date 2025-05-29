import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface IUserState {
  userData: TUser | null;
  isAuth: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: IUserState = {
  userData: null,
  isAuth: false,
  loading: false,
  error: null
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    const response = await registerUserApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    const response = await loginUserApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    deleteCookie('accessToken');
    localStorage.clear();
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    const response = await updateUserApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectIsAuthChecked: (state) => state.isAuth,
    selectUserData: (state) => state.userData
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.userData = action.payload.user;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.loading = false;
        state.userData = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.loading = false;
        state.userData = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = true;
        state.loading = false;
        state.userData = null;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      });
  }
});

export const { selectIsAuthChecked, selectUserData } = userSlice.selectors;

export const userReducer = userSlice.reducer;
