import { rootReducer } from '../store';

describe('rootReducer initial state validation', () => {
  it('should return the initial state when passed an undefined state and unknown action', () => {
    const expectedInitialState = {
      burgerConstructor: { ingredients: [], bun: null },
      feed: { orders: [], total: 0, totalToday: 0, error: null, isLoading: false },
      ingredients: { ingredients: [], isLoading: false, error: null },
      order: { orders: [], orderData: null, orderRequest: false, isLoading: false, error: null },
      user: { userData: null, isAuth: false, loading: false, error: null }
    };

    const actualState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(actualState).toEqual(expectedInitialState);
  });
});
