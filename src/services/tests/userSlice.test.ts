import {
  initialState,
  userReducer,
  getUser,
  registerUser,
  loginUser,
  logoutUser,
  updateUser
} from '../slices/userSlice';

describe('userSlice async actions and reducers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetching user data', () => {
    it('sets loading true on getUser.pending', () => {
      const action = { type: getUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it('updates userData and loading false on getUser.fulfilled', () => {
      const userPayload = { user: { name: 'Иван', email: 'ivan@example.com' } };
      const action = { type: getUser.fulfilled.type, payload: userPayload };
      const state = userReducer(initialState, action);
      expect(state.userData).toEqual(userPayload.user);
      expect(state.loading).toBe(false);
    });

    it('stores error message and stops loading on getUser.rejected', () => {
      const errorMsg = 'Network error';
      const action = { type: getUser.rejected.type, error: { message: errorMsg } };
      const state = userReducer(initialState, action);
      expect(state.error).toBe(errorMsg);
      expect(state.loading).toBe(false);
    });
  });

  describe('user registration flow', () => {
    it('sets loading true on registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it('sets isAuth true and stores user data on registerUser.fulfilled', () => {
      const userData = { name: 'Пётр', email: 'petr@example.com' };
      const action = { type: registerUser.fulfilled.type, payload: userData };
      const state = userReducer(initialState, action);
      expect(state.isAuth).toBe(true);
      expect(state.userData).toEqual(userData);
      expect(state.loading).toBe(false);
    });

    it('records error and resets loading on registerUser.rejected', () => {
      const errorMsg = 'Registration failed';
      const action = { type: registerUser.rejected.type, error: { message: errorMsg } };
      const state = userReducer(initialState, action);
      expect(state.error).toBe(errorMsg);
      expect(state.loading).toBe(false);
    });
  });

  describe('user login flow', () => {
    it('loading true on loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it('stores user info and isAuth true on loginUser.fulfilled', () => {
      const userInfo = { name: 'Алексей', email: 'alex@example.com' };
      const action = { type: loginUser.fulfilled.type, payload: userInfo };
      const state = userReducer(initialState, action);
      expect(state.userData).toEqual(userInfo);
      expect(state.isAuth).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('sets error and loading false on loginUser.rejected', () => {
      const errorMsg = 'Invalid credentials';
      const action = { type: loginUser.rejected.type, error: { message: errorMsg } };
      const state = userReducer(initialState, action);
      expect(state.error).toBe(errorMsg);
      expect(state.loading).toBe(false);
    });
  });

  describe('logoutUser flow', () => {
    it('loading true on logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it('clears userData and sets loading false on logoutUser.fulfilled', () => {
      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(initialState, action);
      expect(state.userData).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.isAuth).toBe(true); // если логика такая
    });

    it('sets error on logoutUser.rejected', () => {
      const errorMsg = 'Logout failed';
      const action = { type: logoutUser.rejected.type, error: { message: errorMsg } };
      const state = userReducer(initialState, action);
      expect(state.error).toBe(errorMsg);
      expect(state.loading).toBe(false);
    });
  });

  describe('updateUser flow', () => {
    it('loading true on updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it('updates userData and sets loading false on updateUser.fulfilled', () => {
      const updatedUser = { name: 'Сергей', email: 'sergey@example.com' };
      const action = { type: updateUser.fulfilled.type, payload: updatedUser };
      const state = userReducer(initialState, action);
      expect(state.userData).toEqual(updatedUser);
      expect(state.loading).toBe(false);
    });

    it('records error on updateUser.rejected', () => {
      const errorMsg = 'Update failed';
      const action = { type: updateUser.rejected.type, error: { message: errorMsg } };
      const state = userReducer(initialState, action);
      expect(state.error).toBe(errorMsg);
      expect(state.loading).toBe(false);
    });
  });
});
